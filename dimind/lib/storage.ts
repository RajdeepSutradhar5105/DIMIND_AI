import type { UIMessage } from "@/components/ChatMessage";

const STORAGE_KEY = "dimind:chat-history:v1";
const MAX_STORED_MESSAGES = 60;

function isQuotaError(e: unknown): boolean {
  return (
    e instanceof DOMException &&
    (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

export function loadHistory(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as UIMessage[];
  } catch {
    // Corrupted or unreadable — start fresh rather than crashing the app.
    return [];
  }
}

export function saveHistory(messages: UIMessage[]): void {
  if (typeof window === "undefined") return;

  const trimmed = messages.slice(-MAX_STORED_MESSAGES);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return;
  } catch (e) {
    if (!isQuotaError(e)) return; // give up quietly on unexpected errors
  }

  // Ran out of space (usually because of base64 QR/PDF attachments) — retry
  // without attachment payloads so at least the conversation text survives.
  try {
    const withoutAttachments = trimmed.map((m) => ({ ...m, attachments: undefined }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutAttachments));
    return;
  } catch {
    // Still too big — keep only the most recent messages, text-only.
  }

  try {
    const recentOnly = trimmed
      .slice(-20)
      .map((m) => ({ ...m, attachments: undefined }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentOnly));
  } catch {
    // Give up — worst case the next reload just starts empty.
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
