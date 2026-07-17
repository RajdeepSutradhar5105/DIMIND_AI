import type { ToolCallRequest } from "./types";

/**
 * Scans left to right and returns every top-level {...} object found in the
 * text, using brace-depth tracking (not regex) so it correctly separates
 * multiple JSON objects even when they're back-to-back or on separate lines
 * — e.g. `{"tool":"time"}\n{"tool":"weather","city":"New York"}`.
 */
function extractJsonObjects(text: string): string[] {
  const objects: string[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escapeNext = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      if (depth > 0) {
        depth--;
        if (depth === 0 && start !== -1) {
          objects.push(text.slice(start, i + 1));
          start = -1;
        }
      }
    }
  }

  return objects;
}

/**
 * Extracts a tool-call JSON object from an LLM response, tolerating fenced
 * code blocks, prose around the JSON, or (occasionally) more than one JSON
 * object in the response — in which case the first valid tool call wins.
 * Mirrors, and hardens, the behaviour of the original parcel.py.
 */
export function parseToolCall(response: string): ToolCallRequest | null {
  if (typeof response !== "string") return null;

  const text = response.trim();
  if (!text) return null;

  const candidates: string[] = [];

  // Whole response as-is (covers the common case: response is just the JSON).
  candidates.push(text);

  // Fenced ```json ... ``` block.
  const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (fenced) candidates.push(fenced[1]);

  // Every balanced top-level {...} object found anywhere in the text, in order.
  candidates.push(...extractJsonObjects(text));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        typeof parsed.tool === "string" &&
        parsed.tool.trim()
      ) {
        return parsed as ToolCallRequest;
      }
    } catch {
      // try next candidate
    }
  }

  return null;
}

/**
 * True when the entire trimmed string is a single JSON value (usually an
 * object) with nothing else around it — used as a defensive check for
 * "the model replied with raw JSON when it should have replied in plain
 * language", regardless of whether that JSON happens to be a valid tool call.
 */
export function looksLikeRawJson(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (!(trimmed.startsWith("{") && trimmed.endsWith("}"))) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}
/**
 * Like parseToolCall, but returns every distinct valid tool call found in
 * the response instead of just the first — for models that occasionally
 * emit more than one JSON object for a compound request (e.g. "time and
 * weather in New York").
 */
export function parseToolCalls(response: string): ToolCallRequest[] {
  if (typeof response !== "string") return [];
  const text = response.trim();
  if (!text) return [];

  const found: ToolCallRequest[] = [];
  const seen = new Set<string>();

  for (const candidate of extractJsonObjects(text)) {
    try {
      const parsed = JSON.parse(candidate);
      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        typeof parsed.tool === "string" &&
        parsed.tool.trim()
      ) {
        const key = candidate.trim();
        if (!seen.has(key)) {
          seen.add(key);
          found.push(parsed as ToolCallRequest);
        }
      }
    } catch {
      // skip malformed fragment
    }
  }

  // Fallback: nothing balanced was found (e.g. single object with no
  // surrounding noise didn't get picked up for some reason) — reuse the
  // single-object parser so behaviour never regresses.
  if (found.length === 0) {
    const single = parseToolCall(text);
    if (single) found.push(single);
  }

  return found;
}
