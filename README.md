# BriefKit

Turn rough app ideas into structured, editable project briefs — planned by a **5-stage Senior PM agent pipeline** instead of a single chat prompt.

## Architecture

```
Browser ──> Next.js /api/generate (streaming proxy) ──> FastAPI :8001 ──> LangGraph pipeline
                                                                        ├─ 1. Interrogate idea
                                                                        ├─ 2. Scope & PM analysis
                                                                        ├─ 3. Architecture design
                                                                        ├─ 4. Risk / cost / security review
                                                                        └─ 5. Synthesis + starter prompt
```

Each stage streams live SSE events (`stage_start` → `stage_token`* → `stage_done`) so the UI shows a stage-by-stage progress stepper instead of one long spinner.

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, shadcn/ui
- **Backend:** Python, FastAPI, LangGraph, LangChain, Pydantic (structured outputs per stage)
- **Model:** `deepseek/deepseek-chat` via OpenRouter (configurable with `BRIEFKIT_MODEL`)

## Getting started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and add your [OpenRouter API key](https://openrouter.ai/keys)
3. Frontend:

```bash
npm install
npm run dev        # http://localhost:3000
```

4. Backend (separate terminal):

```bash
cd backend
python3 -m virtualenv venv      # or: python3 -m venv venv
venv/bin/pip install -r requirements.txt
venv/bin/uvicorn main:app --port 8001
```

5. Open [http://localhost:3000](http://localhost:3000) and describe an idea.

> The Next.js route proxies to `http://localhost:8001` — override with `BRIEFKIT_BACKEND_URL` if needed.

## API

`POST /api/generate-stream` (FastAPI) — body `{ "idea": "..." }`, responds `text/event-stream`:

| Event | Payload |
|---|---|
| `stage_start` | `{ stage: 1-5, label }` |
| `stage_token` | `{ stage, token }` (live text) |
| `stage_done` | `{ stage, data }` (validated Pydantic JSON) |
| `brief_complete` | `{ brief: ProjectBrief }` |
| `error` | `{ error: "short-input" \| "invalid-idea" \| ..., message?, details? }` |

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

The frontend can deploy alone if `BRIEFKIT_BACKEND_URL` points at a hosted FastAPI instance; set `OPENROUTER_API_KEY` on the backend.

---

Built by [Qaziaaaa](https://github.com/Qaziaaaa)
