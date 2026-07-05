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
      error: "short-input",
      message: "Tell me a bit more about your idea — what does it do and who is it for?",
    })
  }

  const model = groq("llama-3.3-70b-versatile")

  const { text } = await generateText({
    model,
    temperature: 0.5,
    prompt: `You are a senior software engineer and technical strategist. Your job is to take a rough project idea and turn it into a concrete, actionable project brief.

Read this idea: """${idea}"""

First, identify what KIND of project this is — could be a web app, mobile app, API/microservice, CLI tool, game, design system, data pipeline, e-commerce store, SaaS platform, internal tool, real-estate system, or something else. Your output must be tailored to that type.

Then produce a JSON brief with these fields:

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
- If the idea is too vague to work with, include a field "feedback" with a sentence suggesting how they could clarify it, but still do your best to produce a full brief based on your best interpretation.
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