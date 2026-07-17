import type { Attachment } from "@/lib/types";
import { DownloadCard } from "./DownloadCard";
import { LogoMark } from "./Logo";

export interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: { name: string }[];
  attachments?: Attachment[];
  isError?: boolean;
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex animate-fadeUp gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-edge bg-panel">
        {isUser ? (
          <span className="text-xs font-semibold text-ink-dim">You</span>
        ) : (
          <LogoMark size={18} />
        )}
      </div>

      <div className={`flex max-w-[80%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        {message.tools && message.tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.tools.map((tool, i) => (
              <span
                key={`${tool.name}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-synapse/30 bg-synapse-gradient-soft px-2.5 py-0.5 text-[11px] font-medium text-synapse-soft"
              >
                <span className="h-1 w-1 rounded-full bg-synapse-soft" />
                {tool.name}
              </span>
            ))}
          </div>
        )}

        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            isUser
              ? "rounded-tr-sm border-synapse/25 bg-synapse-gradient-soft text-ink"
              : message.isError
              ? "rounded-tl-sm border-red-500/30 bg-red-500/5 text-red-300"
              : "rounded-tl-sm border-edge bg-panel text-ink"
          }`}
        >
          <p className="prose-chat">{message.content}</p>
          {message.attachments?.map((attachment, i) => (
            <DownloadCard key={`${attachment.filename}-${i}`} attachment={attachment} />
          ))}
        </div>
      </div>
    </div>
  );
}
