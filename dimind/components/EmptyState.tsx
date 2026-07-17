import { LogoMark } from "./Logo";

const SUGGESTIONS = [
  "What's 18% of 2,450?",
  "Weather in Ghaziabad right now",
  "Convert 10 km to miles",
  "Define the word 'ephemeral'",
  "Make a QR code for https://github.com",
  "Explain this code: for i in range(5): print(i)",
];

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-edge bg-panel shadow-glow">
        <LogoMark size={38} />
      </div>
      <h1 className="font-display text-2xl font-semibold text-ink">Welcome to Dimind</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-dim">
        An agent that reasons, then reaches for the right tool — calculator, weather,
        dictionary, unit conversion, QR codes, PDFs, and code explanations.
      </p>

      <div className="mt-7 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-xl border border-edge bg-panel px-4 py-3 text-left text-sm text-ink-dim transition hover:border-pulse/40 hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
