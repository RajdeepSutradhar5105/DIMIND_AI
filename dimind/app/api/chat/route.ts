import { NextRequest, NextResponse } from "next/server";
import { groqChat, GroqConfigError } from "@/lib/groq";
import { SYSTEM_PROMPT, FINAL_ANSWER_SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { parseToolCall, parseToolCalls, looksLikeRawJson } from "@/lib/parseToolCall";
import { executeTool, TOOL_LABELS } from "@/lib/tools";
import type { Attachment, ChatApiRequest, ChatApiResponse, ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

// A generous but bounded amount of prior turns sent back to the model on
// every request, since the API route itself is stateless between calls.
const MAX_HISTORY_MESSAGES = 24;

// Safety cap in case a response somehow contains many JSON-shaped fragments.
const MAX_TOOL_CALLS_PER_TURN = 4;

const SANITIZED_PLACEHOLDER =
  "(Answered using a tool. Details omitted here to avoid confusing the model with raw tool-call formatting.)";

/**
 * Older browser sessions can still be holding a raw JSON tool-call string
 * as an "assistant" turn from before this fix (or from a model hiccup).
 * Feeding that back to the model as conversation history strongly biases
 * it to reply in JSON again — so we scrub any such turn before every call.
 */
function sanitizeHistoryForModel(history: ChatMessage[]): ChatMessage[] {
  return history.map((message) => {
    if (message.role === "assistant" && looksLikeRawJson(message.content)) {
      return { ...message, content: SANITIZED_PLACEHOLDER };
    }
    return message;
  });
}

/** Deterministic, always-safe plain-text answer built directly from tool
 * results, used only if the model still won't stop returning JSON after a
 * retry — guarantees the user never sees a raw JSON blob. */
function buildFallbackAnswer(
  executed: { toolName: string; result: { text: string } }[]
): string {
  return executed.map(({ toolName, result }) => `${TOOL_LABELS[toolName.toLowerCase()] ?? toolName}: ${result.text}`).join("\n\n");
}

export async function POST(req: NextRequest) {
  let body: ChatApiRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  if (history.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const trimmedHistory = sanitizeHistoryForModel(history.slice(-MAX_HISTORY_MESSAGES));

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...trimmedHistory,
  ];

  try {
    const llmResponse = await groqChat(messages);
    const toolRequests = parseToolCalls(llmResponse).slice(0, MAX_TOOL_CALLS_PER_TURN);

    if (toolRequests.length === 0) {
      // Defensive: if the model didn't produce a recognizable tool call but
      // still replied with a raw JSON blob (e.g. malformed tool call), don't
      // show that to the user — ask plainly instead of leaking JSON.
      const reply = looksLikeRawJson(llmResponse)
        ? "I wasn't able to work out how to answer that — could you rephrase your question?"
        : llmResponse || "I couldn't generate a response.";
      const payload: ChatApiResponse = { reply };
      return NextResponse.json(payload);
    }

    // Run every tool call the model asked for (usually one; occasionally
    // more for a compound question like "time and weather in New York").
    const executed = await Promise.all(
      toolRequests.map(async (request) => {
        const toolName = String(request.tool || "").trim();
        try {
          const result = await executeTool(request);
          return { toolName, request, result };
        } catch (e: any) {
          return { toolName, request, result: { text: `Tool error: ${e?.message ?? e}` } };
        }
      })
    );

    const toolResultText = executed
      .map(({ toolName, result }) => `[${toolName}] ${result.text}`)
      .join("\n\n");

    // The follow-up call gets a dedicated "just answer in plain language"
    // system prompt (not the tool-calling one) and never sees the raw JSON
    // tool-call turn, so nothing nudges it back toward JSON output.
    const followUpMessages: ChatMessage[] = [
      { role: "system", content: FINAL_ANSWER_SYSTEM_PROMPT },
      ...trimmedHistory,
      {
        role: "user",
        content: `Tool result(s):\n${toolResultText}\n\nUsing only the information above, answer my question in plain conversational language. Do not output JSON.`,
      },
    ];

    let finalResponse = await groqChat(followUpMessages);

    // Safety net: if the model still replied with JSON (or another tool
    // call), retry once with a sharper instruction before falling back to a
    // deterministic, guaranteed-plain-text answer built from the results.
    if (looksLikeRawJson(finalResponse) || parseToolCall(finalResponse)) {
      const retryMessages: ChatMessage[] = [
        ...followUpMessages,
        { role: "assistant", content: finalResponse },
        {
          role: "user",
          content:
            "That was JSON again, which is not allowed at this stage. Reply with one or two plain English sentences only — no braces, no quotes-as-JSON, no tool calls.",
        },
      ];
      finalResponse = await groqChat(retryMessages);

      if (looksLikeRawJson(finalResponse) || parseToolCall(finalResponse)) {
        finalResponse = buildFallbackAnswer(executed);
      }
    }

    const attachments: Attachment[] = executed
      .map((e) => e.result.attachment)
      .filter((a): a is Attachment => Boolean(a));

    const tools = executed.map(({ toolName, request }) => {
      const { tool: _omit, ...args } = request;
      return { name: TOOL_LABELS[toolName.toLowerCase()] ?? toolName, args };
    });

    const payload: ChatApiResponse = {
      reply: finalResponse || buildFallbackAnswer(executed),
      tool: tools[0],
      tools,
      attachment: attachments[0],
      attachments,
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    if (e instanceof GroqConfigError) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: `Something went wrong: ${e?.message ?? e}` },
      { status: 500 }
    );
  }
}
