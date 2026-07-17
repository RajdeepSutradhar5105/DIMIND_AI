export function ThinkingIndicator({ label = "Dimind is thinking" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-edge bg-panel px-4 py-3">
      <svg width="46" height="18" viewBox="0 0 46 18" aria-hidden="true">
        <line x1="4" y1="9" x2="23" y2="9" stroke="#2a2d55" strokeWidth="1.5" />
        <line x1="23" y1="9" x2="42" y2="9" stroke="#2a2d55" strokeWidth="1.5" />
        <circle cx="4" cy="9" r="3.4" fill="#3b6fff" className="animate-fireNode" style={{ animationDelay: "0ms" }} />
        <circle cx="23" cy="9" r="3.4" fill="#8b5cf6" className="animate-fireNode" style={{ animationDelay: "220ms" }} />
        <circle cx="42" cy="9" r="3.4" fill="#d946ef" className="animate-fireNode" style={{ animationDelay: "440ms" }} />
      </svg>
      <span className="text-xs font-medium text-ink-dim">{label}…</span>
    </div>
  );
}
