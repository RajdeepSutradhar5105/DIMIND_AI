import type { ChatMessage } from "./types";

const BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export class GroqConfigError extends Error {}

export async function groqChat(
  messages: ChatMessage[],
  options?: { temperature?: number }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqConfigError(
      "GROQ_API_KEY is not set. Add it in your Vercel project's Environment Variables (or .env.local for local dev)."
    );
  }

  const model = process.env.MODEL_NAME || DEFAULT_MODEL;

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Groq API returned an unexpected response shape.");
  }
  return content.trim();
}
