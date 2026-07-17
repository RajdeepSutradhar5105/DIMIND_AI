"use client";

import { LogoMark, LogoWordmark } from "./Logo";

export function Header({ onClear, hasMessages }: { onClear: () => void; hasMessages: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-edge-soft bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <div className="flex flex-col leading-none">
            <LogoWordmark className="text-lg" />
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-faint">
              Artificial Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-edge bg-panel px-3 py-1 text-xs text-ink-dim sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Agent online
          </span>
          {hasMessages && (
            <button
              onClick={onClear}
              className="rounded-full border border-edge bg-panel px-3 py-1.5 text-xs font-medium text-ink-dim transition hover:border-signal/40 hover:text-ink"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
