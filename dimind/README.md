# Dimind — Artificial Intelligence

An agentic AI assistant with a calculator, live weather, dictionary, unit
converter, QR code generator, PDF generator, and code explainer — built as a
Next.js app so it deploys straight from GitHub to Vercel.

This is a rebuild of the original Python (Streamlit) prototype. The agent
logic, tool set, and behavior are preserved, but everything now runs as a
Next.js frontend + serverless API route so it can run on Vercel (Streamlit
needs a persistent server, which Vercel's serverless platform doesn't
support).

## ⚠️ Before you do anything: rotate your API key

The original `config.py` had a live Groq API key hardcoded in plain text.
That key must be treated as compromised. Go to
[console.groq.com/keys](https://console.groq.com/keys), delete it, and
generate a new one. Never commit an API key to a file that goes into git —
this project instead reads it from an environment variable that you set in
Vercel (or a local `.env.local` that's git-ignored).

## 1. Run it locally (optional)

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your new GROQ_API_KEY
npm run dev
```

Open http://localhost:3000.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Dimind AI agent"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env.local` is already in `.gitignore`, so your key won't be pushed.

## 3. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
   Vercel auto-detects Next.js — no build config needed.
2. Before clicking **Deploy**, open **Environment Variables** and add:
   - `GROQ_API_KEY` = your key from console.groq.com
   - `MODEL_NAME` (optional) = `llama-3.3-70b-versatile`
3. Click **Deploy**. Every future push to `main` redeploys automatically.

## How it works

- `app/page.tsx` — chat UI. Conversation history lives in the browser tab and
  is sent with each request (Vercel functions are stateless, so there's no
  server-side `memory.json` file anymore).
- `app/api/chat/route.ts` — the agent loop: sends the conversation + system
  prompt to Groq, checks whether the model asked for a tool (a JSON object),
  runs that tool, then asks the model for a final answer using the tool's
  result. This mirrors the original `Agent.py` / `parcel.py`.
- `lib/tools/*` — TypeScript ports of `Tools/*.py`:
  - `calculator.ts` — hand-written expression parser (no `eval`)
  - `time.ts` — current date/time
  - `weather.ts` — Open-Meteo (no key required)
  - `dictionary.ts` — dictionaryapi.dev
  - `unit.ts` — length/weight/temperature conversion
  - `qr.ts` — QR PNG via api.qrserver.com, returned to the browser as a
    downloadable file
  - `pdf.ts` — builds a real PDF with `pdf-lib`, returned as a downloadable
    file
  - `explainer.ts` — asks Groq to explain a code snippet

## Notes & possible upgrades

- **Chat history now persists** in the browser via `localStorage`
  (`lib/storage.ts`) — closing the tab or reloading the page no longer
  loses your conversation. This is per-browser, not synced across devices,
  since the API route itself is still stateless (serverless functions don't
  keep state between requests). If you want history synced across devices,
  swap `lib/storage.ts` for a real database — Vercel Postgres, Vercel KV, or
  Supabase all work well with Next.js on Vercel.
- **Rate limits**: Groq's free tier and Open-Meteo/dictionaryapi.dev are all
  rate-limited. For production traffic, consider caching or a paid tier.
