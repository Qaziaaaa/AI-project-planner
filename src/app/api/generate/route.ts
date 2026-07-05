import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  const { idea } = await req.json()

  if (!idea || typeof idea !== "string") {
    return Response.json({ error: "Idea is required" }, { status: 400 })
  }

  if (idea.trim().length < 10) {
    return Response.json({
      error: "invalid-idea",
      message: "That doesn't look like a real project idea. Try describing what your app does, who it's for, and what problem it solves.",
    })
  }

  const model = groq("llama-3.3-70b-versatile")

  const { text } = await generateText({
    model,
    temperature: 0.5,
    prompt: `You are a senior software engineer and technical strategist. Your job is to take a rough project idea and turn it into a concrete, actionable project brief.

Read this idea: """${idea}"""

DECIDE which case this is:
- CASE A — Real project idea (describes something specific, even if brief): produce the full brief JSON.
- CASE B — Vague but has real intent (e.g. "a social media app"): produce the full brief AND include a "feedback" field suggesting how to clarify.
- CASE C — Complete nonsense, gibberish, keyboard spam, Lorem Ipsum, or text that does not describe ANY real project idea: respond with ONLY {"error":"invalid-idea","message":"That doesn't look like a real project idea. Try describing what your app does, who it's for, and what problem it solves."}

If CASE A or B, produce a JSON brief with these fields:

{
  "projectType": "the type you identified",
  "summary": "2-3 sentence summary of what this project does, who it serves, and why it exists",
  "targetUsers": "who the users are — roles, goals, skill level, context",
  "coreFeatures": [{"name": "short name", "description": "what it does and why it matters", "priority": "high|medium|low"}],
  "techStack": [{"category": "area", "items": ["specific technology choice"]}],
  "pages": [{"path": "/url-path", "name": "Page Name", "description": "what this page does"}],
  "dataModel": [{"id": "entity-id", "name": "Entity Name", "attributes": [{"name": "field", "type": "data type"}], "relationships": [{"targetId": "other-entity", "type": "relation type"}]}],
  "buildPhases": [{"phase": "Phase Name", "tasks": ["specific task"], "duration": "estimate"}],
  "risks": [{"risk": "what could go wrong", "mitigation": "how to prevent or handle it", "severity": "high|medium|low"}],
  "starterPrompt": "a detailed prompt a developer could use to build this from scratch"
}

RULES:
- Choose a tech stack that actually fits the project. A game doesn't need Next.js. A CLI tool doesn't need a database. A design system doesn't need auth.
- Every field must be specific to THIS project. No generic filler.
- For the starterPrompt, structure it with these sections: PROJECT OVERVIEW, TECH STACK, CORE FEATURES, DATA MODEL, PAGES/ROUTES, IMPLEMENTATION ORDER, EDGE CASES & NOTES, CODING STANDARDS. Fill each with concrete details — real file paths, real component names, real database fields.
- Respond with ONLY the JSON object — no markdown, no code fences, no extra text.`,
  })

  let cleaned = text.trim()
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) cleaned = fenceMatch[1].trim()

  const jsonStart = cleaned.indexOf("{")
  const jsonEnd = cleaned.lastIndexOf("}")
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1)
  }

  try {
    const object = JSON.parse(cleaned)
    return Response.json(object)
  } catch {
    return Response.json({ error: "Failed to parse response", raw: text }, { status: 500 })
  }
}