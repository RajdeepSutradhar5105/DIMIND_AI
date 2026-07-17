import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05060f",
        panel: "#0b0d1c",
        elevated: "#10132a",
        edge: "#1e2145",
        "edge-soft": "#171a38",
        ink: "#f2f3fb",
        "ink-dim": "#8a8db0",
        "ink-faint": "#565a80",
        synapse: "#3b6fff",
        "synapse-soft": "#5a86ff",
        pulse: "#8b5cf6",
        signal: "#d946ef",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "synapse-gradient": "linear-gradient(135deg, #3b6fff 0%, #8b5cf6 55%, #d946ef 100%)",
        "synapse-gradient-soft": "linear-gradient(135deg, rgba(59,111,255,0.15) 0%, rgba(217,70,239,0.10) 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,92,246,0.25), 0 8px 30px rgba(59,111,255,0.15)",
        "glow-strong": "0 0 40px rgba(139,92,246,0.35)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-6px,0)" },
        },
        fireNode: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        fireNode: "fireNode 1.4s ease-in-out infinite",
        fadeUp: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
