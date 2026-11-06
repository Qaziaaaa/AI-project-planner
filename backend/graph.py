"""LangGraph 5-stage Senior PM pipeline.

Stages: interrogate -> scope -> architect -> review -> synthesize
Streams token/stage events via run_pipeline() async generator.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any, AsyncGenerator, TypedDict

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel, ValidationError

from schemas import (
    ArchitectureSpec,
    IdeaAnalysis,
    ProjectBrief,
    ReviewSpec,
    ScopeSpec,
)

_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_ROOT / ".env.local")
load_dotenv(_ROOT / ".env")

MODEL = os.getenv("BRIEFKIT_MODEL", "deepseek/deepseek-chat")
BASE_URL = "https://openrouter.ai/api/v1"

STAGES: list[tuple[str, int, str]] = [
    ("interrogate", 1, "Interrogating idea"),
    ("scope", 2, "Scoping & PM analysis"),
    ("architect", 3, "Designing architecture"),
    ("review", 4, "Risk, cost & security review"),
    ("synthesize", 5, "Synthesizing brief"),
]
NODE_TO_STAGE = {node: stage for node, stage, _ in STAGES}
STAGE_TO_KEY = {1: "analysis", 2: "scope", 3: "architecture", 4: "review", 5: "brief"}
STAGE_LABEL = {stage: label for _, stage, label in STAGES}


class PipelineState(TypedDict, total=False):
    idea: str
    analysis: dict
    scope: dict
    architecture: dict
    review: dict
    brief: dict


def _llm(temperature: float = 0.3) -> ChatOpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")
    # Force fast providers: default OpenRouter routing can pick slow relays
    # (measured ~105 chars/s vs 240-350 chars/s on Novita/DeepSeek).
    provider_order = [
        p.strip()
        for p in os.getenv("BRIEFKIT_PROVIDERS", "Novita,DeepSeek").split(",")
        if p.strip()
    ]
    return ChatOpenAI(
        model=MODEL,
        openai_api_base=BASE_URL,
        api_key=api_key,
        temperature=temperature,
        streaming=True,
        extra_body={"provider": {"order": provider_order}},
    )


def _chunk_text(chunk: Any) -> str:
    content = getattr(chunk, "content", None)
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and block.get("type") in (None, "text"):
                parts.append(str(block.get("text", "")))
        return "".join(parts)
    return ""


def _extract_json_text(text: str) -> str:
    t = text.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", t)
    if fence:
        t = fence.group(1).strip()
    start, end = t.find("{"), t.rfind("}")
    if start != -1 and end > start:
        t = t[start : end + 1]
    return t


async def _parse_stage(model_type: type[BaseModel], raw: str) -> BaseModel:
    """Parse streamed text into a stage model; retry with structured output on failure."""
    try:
        return model_type.model_validate_json(_extract_json_text(raw))
    except (ValidationError, json.JSONDecodeError):
        structured = _llm(temperature=0.1).with_structured_output(model_type)
        return await structured.ainvoke(
            [
                (
                    "system",
                    "Reformat the user's draft into valid JSON matching the required schema. "
                    "Output JSON only.",
                ),
                ("human", raw[:16000] if raw else "(empty response)"),
            ]
        )


def _pretty(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2)


# --- Stage prompts ---

_INTERROGATE_SYS = """You are a senior discovery analyst on a software delivery team.
Given a raw project idea, decide whether it is a genuine project idea (not gibberish),
surface the assumptions you must make, auto-resolve ambiguous requirements as explicit
decisions, and restate the idea precisely enough for a PM, architect and risk officer
to plan from.

Rules:
- isValid=false ONLY when the input is nonsense, spam, or not a software project at all.
- Keep assumptions and clarifications concrete and few (max 5 each).
- refinedIdea must be a single dense paragraph.
- Output ONE compact single-line JSON object: no pretty-printing, no indentation, no markdown fences, no commentary."""

_SCOPE_SYS = """You are a senior technical project manager. Using the refined idea and
discovery notes, define scope: executive summary, target users/personas, core features
with MoSCoW-style priorities (high/medium/low) and Given/When/Then acceptance criteria,
and phased build plan with concrete tasks and realistic durations.

Rules:
- 5 to 8 core features, each with 2-3 acceptance criteria (max 20 words each).
- 3 to 6 build phases; durations like "3 days", "1 week".
- Descriptions: 1-2 sentences each. Be concrete: real user jobs, not generic filler.
- Output ONE compact single-line JSON object matching the required schema: no pretty-printing, no indentation, no markdown fences, no commentary."""

_ARCHITECT_SYS = """You are a principal software architect. Using the scope below,
choose the architecture type, tech stack (Frontend/Backend/Database/DevOps categories with
rationale), routes/pages, a normalized data model (ids, attributes with types,
relationships), and initial code scaffolding (file tree + key config files with real content).

Rules:
- Prefer a boring, proven stack that a small team can ship fast unless the idea demands otherwise.
- dataModel entities need stable ids referenced by relationships.targetId.
- codeScaffolding.fileTree uses newlines and two-space indentation.
- initialConfigs: include package.json (or pyproject.toml) and one core config with real content.
- Output ONE compact single-line JSON object matching the required schema: no pretty-printing, no indentation, no markdown fences, no commentary."""

_REVIEW_SYS = """You are a risk officer and finance reviewer. Using the scope and
architecture below, produce: a risk register (risk, mitigation, severity high/medium/low),
a monthly cost estimate (hosting, database, third-party services, total) grounded in
realistic current pricing, and a security checklist (categories: Auth, Data, Network,
Compliance) with requirement + actionable recommendation.

Rules:
- 4 to 8 risks spanning technical, delivery and product risk.
- 4 to 8 security items.
- Costs in USD/month with a real tier ("free tier", "Hobby $20/mo", etc.).
- Output ONE compact single-line JSON object matching the required schema: no pretty-printing, no indentation, no markdown fences, no commentary."""

_SYNTHESIZE_SYS = """You are the PMO director writing the final handoff artifact for a
coding agent. From the planning inputs, write ONLY the starterPrompt field content:
a comprehensive 500+ word implementation prompt containing all 11 sections —
OVERVIEW, TECH STACK, ARCHITECTURE, CORE FEATURES, DATA MODEL, API ENDPOINTS, PAGES,
IMPLEMENTATION ORDER, EDGE CASES, TESTING, CODING STANDARDS — with exact file paths,
component names, package names and database field types. Plain text only: no JSON,
no markdown code fences around the whole answer, no commentary before or after."""


# --- Graph nodes ---


async def interrogate_node(state: PipelineState) -> dict:
    idea = state["idea"]
    raw = ""
    async for chunk in _llm().astream(
        [
            ("system", _INTERROGATE_SYS),
            ("human", f"Project idea:\n{idea}"),
        ]
    ):
        raw += _chunk_text(chunk)
    parsed = await _parse_stage(IdeaAnalysis, raw)
    return {"analysis": parsed.model_dump()}


async def scope_node(state: PipelineState) -> dict:
    analysis = state["analysis"]
    raw = ""
    async for chunk in _llm().astream(
        [
            ("system", _SCOPE_SYS),
            (
                "human",
                f"Refined idea:\n{analysis.get('refinedIdea', state['idea'])}\n\n"
                f"Discovery notes:\n{_pretty(analysis)}",
            ),
        ]
    ):
        raw += _chunk_text(chunk)
    parsed = await _parse_stage(ScopeSpec, raw)
    return {"scope": parsed.model_dump()}


async def architect_node(state: PipelineState) -> dict:
    raw = ""
    async for chunk in _llm().astream(
        [
            ("system", _ARCHITECT_SYS),
            (
                "human",
                f"Idea:\n{state['analysis'].get('refinedIdea', state['idea'])}\n\n"
                f"Scope:\n{_pretty(state['scope'])}",
            ),
        ]
    ):
        raw += _chunk_text(chunk)
    parsed = await _parse_stage(ArchitectureSpec, raw)
    return {"architecture": parsed.model_dump()}


async def review_node(state: PipelineState) -> dict:
    raw = ""
    async for chunk in _llm().astream(
        [
            ("system", _REVIEW_SYS),
            (
                "human",
                f"Scope:\n{_pretty(state['scope'])}\n\n"
                f"Architecture:\n{_pretty(state['architecture'])}",
            ),
        ]
    ):
        raw += _chunk_text(chunk)
    parsed = await _parse_stage(ReviewSpec, raw)
    return {"review": parsed.model_dump()}


async def synthesize_node(state: PipelineState) -> dict:
    analysis = state["analysis"]
    scope = state["scope"]
    architecture = state["architecture"]
    review = state["review"]

    # Stream the starterPrompt (largest single artifact)
    prompt = ""
    async for chunk in _llm(temperature=0.4).astream(
        [
            ("system", _SYNTHESIZE_SYS),
            (
                "human",
                f"Scope:\n{_pretty(scope)}\n\n"
                f"Architecture:\n{_pretty(architecture)}\n\n"
                f"Review:\n{_pretty(review)}\n\n"
                f"Discovery:\n{_pretty(analysis)}",
            ),
        ]
    ):
        prompt += _chunk_text(chunk)
    starter_prompt = prompt.strip()

    feedback_parts: list[str] = []
    clarifications = [c for c in (analysis.get("clarifications") or []) if c][:4]
    assumptions = [a for a in (analysis.get("assumptions") or []) if a][:3]
    if clarifications:
        feedback_parts.append("Auto-resolved: " + "; ".join(clarifications))
    if assumptions:
        feedback_parts.append("Assumptions: " + "; ".join(assumptions))
    feedback = "  ·  ".join(feedback_parts) if feedback_parts else None
    if feedback and len(feedback) > 600:
        feedback = feedback[:597] + "..."

    brief = {
        "projectType": architecture.get("projectType"),
        "summary": scope.get("summary", ""),
        "targetUsers": scope.get("targetUsers", ""),
        "coreFeatures": scope.get("coreFeatures", []),
        "techStack": architecture.get("techStack", []),
        "pages": architecture.get("pages", []),
        "dataModel": architecture.get("dataModel", []),
        "buildPhases": scope.get("buildPhases", []),
        "risks": review.get("risks", []),
        "starterPrompt": starter_prompt,
        "feedback": feedback,
        "costEstimate": review.get("costEstimate"),
        "securityChecklist": review.get("securityChecklist"),
        "codeScaffolding": architecture.get("codeScaffolding"),
    }
    # Validate the assembled brief against the frontend contract
    ProjectBrief.model_validate(brief)
    return {"brief": brief}


def _route_after_interrogate(state: PipelineState) -> str:
    analysis = state.get("analysis") or {}
    return "valid" if analysis.get("isValid", True) else "invalid"


def build_graph():
    g = StateGraph(PipelineState)
    g.add_node("interrogate", interrogate_node)
    g.add_node("scope", scope_node)
    g.add_node("architect", architect_node)
    g.add_node("review", review_node)
    g.add_node("synthesize", synthesize_node)
    g.add_edge(START, "interrogate")
    g.add_conditional_edges(
        "interrogate",
        _route_after_interrogate,
        {"valid": "scope", "invalid": END},
    )
    g.add_edge("scope", "architect")
    g.add_edge("architect", "review")
    g.add_edge("review", "synthesize")
    g.add_edge("synthesize", END)
    return g.compile()


_graph = None


def get_graph():
    global _graph
    if _graph is None:
        _graph = build_graph()
    return _graph


def _stage_start_event(stage: int) -> dict:
    return {"type": "stage_start", "stage": stage, "label": STAGE_LABEL[stage]}


async def run_pipeline(idea: str) -> AsyncGenerator[dict, None]:
    """Run the 5-stage graph, yielding SSE-ready event dicts in order."""
    graph = get_graph()
    started: set[int] = set()

    def start(stage: int) -> dict | None:
        if stage in started:
            return None
        started.add(stage)
        return _stage_start_event(stage)

    first = start(1)
    if first:
        yield first

    async for mode, payload in graph.astream(
        {"idea": idea}, stream_mode=["messages", "updates"]
    ):
        if mode == "messages":
            chunk, meta = payload
            stage = NODE_TO_STAGE.get((meta or {}).get("langgraph_node"))
            if stage is None:
                continue
            text = _chunk_text(chunk)
            if text:
                yield {"type": "stage_token", "stage": stage, "token": text}
        else:
            for node, update in payload.items():
                stage = NODE_TO_STAGE.get(node)
                if stage is None or not isinstance(update, dict):
                    continue
                data = update.get(STAGE_TO_KEY[stage])
                if data is None:
                    continue
                if stage == 1 and not data.get("isValid", True):
                    yield {
                        "type": "error",
                        "error": "invalid-idea",
                        "message": data.get("reasoning")
                        or "That doesn't look like a project idea — try describing the app you want to build.",
                    }
                    return
                evt = start(stage)
                if evt:
                    yield evt
                if stage == 5:
                    yield {"type": "stage_done", "stage": 5, "data": data}
                    yield {"type": "brief_complete", "brief": data}
                    return
                yield {"type": "stage_done", "stage": stage, "data": data}
                if stage < 5:
                    nxt = start(stage + 1)
                    if nxt:
                        yield nxt
