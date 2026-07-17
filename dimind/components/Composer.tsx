"use client";

import { FormEvent, KeyboardEvent, useRef } from "react";

export function Composer({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-20 border-t border-edge-soft bg-void/90 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-4 sm:px-0">
        <div className="flex items-end gap-2 rounded-2xl border border-edge bg-panel p-2 pl-4 transition focus-within:border-pulse/50 focus-within:shadow-glow">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dimind anything, or hand it a task…"
            rows={1}
            disabled={disabled}
            className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-synapse-gradient text-white transition disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h15M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 px-1 text-center text-[11px] text-ink-faint">
          Dimind can make mistakes. Verify important results.
        </p>
      </form>
    </div>
  );
}
