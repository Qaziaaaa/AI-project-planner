"""BriefKit Senior PM Agent API — LangGraph 5-stage pipeline over SSE."""

from __future__ import annotations

import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from graph import run_pipeline

load_dotenv(".env.local")
load_dotenv(".env")

app = FastAPI(title="BriefKit Senior PM Agent API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _sse(payload: dict) -> str:
    return f"event: {payload['type']}\ndata: {json.dumps(payload, ensure_ascii=False)}\n\n"


@app.get("/")
async def health() -> dict:
    return {
        "status": "ok",
        "service": "briefkit-senior-pm",
        "model": os.getenv("BRIEFKIT_MODEL", "deepseek/deepseek-chat"),
        "hasKey": bool(os.getenv("OPENROUTER_API_KEY")),
    }


@app.post("/api/generate-stream")
@app.post("/generate-stream")  # alias: Vercel may strip the /api prefix
async def generate_stream(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    idea = str(body.get("idea") or "").strip()

    if not idea:
        return JSONResponse({"error": "Idea is required"}, status_code=400)
    if len(idea) < 5:
        return JSONResponse(
            {
                "error": "short-input",
                "message": "Please describe your idea in at least a few words.",
            },
            status_code=400,
        )
    if not os.getenv("OPENROUTER_API_KEY"):
        return JSONResponse(
            {
                "error": "Configuration error: OPENROUTER_API_KEY missing",
                "details": "Set OPENROUTER_API_KEY in .env.local",
            },
            status_code=500,
        )

    async def event_gen():
        try:
            async for event in run_pipeline(idea):
                yield _sse(event)
        except Exception as exc:  # surface any pipeline failure as a typed SSE error
            yield _sse(
                {
                    "type": "error",
                    "error": "generation_failed",
                    "details": str(exc),
                }
            )

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
