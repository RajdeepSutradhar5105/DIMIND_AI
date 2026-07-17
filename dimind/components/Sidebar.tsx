const TOOLS = [
  { icon: "∑", name: "Calculator", desc: "Arithmetic, algebra, functions" },
  { icon: "◔", name: "Time", desc: "Current date & time" },
  { icon: "☁", name: "Weather", desc: "Live conditions by city" },
  { icon: "▤", name: "Dictionary", desc: "Word definitions" },
  { icon: "⇄", name: "Unit Converter", desc: "Length, weight, temp" },
  { icon: "▦", name: "QR Generator", desc: "Text or link to QR" },
  { icon: "▧", name: "PDF Generator", desc: "Structured documents" },
  { icon: "</>", name: "Code Explainer", desc: "Explains source code" },
];

export function Sidebar({ messageCount, userCount }: { messageCount: number; userCount: number }) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 lg:flex">
      <div className="rounded-2xl border border-edge bg-panel/60 p-4">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Neural Modules
        </h2>
        <ul className="flex flex-col gap-1">
          {TOOLS.map((tool) => (
            <li
              key={tool.name}
              className="group flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-elevated"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-edge bg-void font-mono text-sm text-synapse-soft transition group-hover:border-pulse/50 group-hover:text-pulse">
                {tool.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{tool.name}</p>
                <p className="truncate text-xs text-ink-faint">{tool.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-edge bg-panel/60 p-4">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Session
        </h2>
        <div className="flex items-center justify-between py-1.5 text-sm">
          <span className="text-ink-dim">Messages</span>
          <span className="font-mono text-ink">{messageCount}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 text-sm">
          <span className="text-ink-dim">Your queries</span>
          <span className="font-mono text-ink">{userCount}</span>
        </div>
      </div>
    </aside>
  );
}
