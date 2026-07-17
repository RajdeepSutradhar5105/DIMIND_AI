export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface Attachment {
  type: "qr" | "pdf";
  filename: string;
  /** Direct URL to fetch/display the file (used for QR images). */
  url?: string;
  /** Base64-encoded file bytes (used for generated PDFs). */
  base64?: string;
  mime: string;
}

export interface ToolCallRequest {
  tool: string;
  [key: string]: unknown;
}

export interface ToolExecutionResult {
  /** Plain-text summary fed back to the LLM for its final answer. */
  text: string;
  attachment?: Attachment;
}

export interface ChatApiRequest {
  messages: ChatMessage[];
}

export interface ChatApiResponse {
  reply: string;
  tool?: {
    name: string;
    args: Record<string, unknown>;
  };
  tools?: { name: string; args: Record<string, unknown> }[];
  attachment?: Attachment;
  attachments?: Attachment[];
}
