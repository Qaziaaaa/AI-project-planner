import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  const { idea } = await req.json()

  if (!idea || typeof idea !== "string") {
    return Response.json({ error: "Idea is required" }, { status: 400 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return Response.json({ error: "Configuration error: OPENROUTER_API_KEY missing" }, { status: 500 })
  }

  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  })

  // Using deepseek/deepseek-chat for reliable, top-tier generation via OpenRouter
  const model = openrouter("deepseek/deepseek-chat")

  let text: string
  try {
    const result = await generateText({
      model,
      temperature: 0.5,
      prompt: `You are a senior software engineer and technical strategist. Your job is to take a rough project idea and turn it into a concrete, actionable project brief.

Read this idea: """${idea}"""

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
  "starterPrompt": "a comprehensive, production-ready coding agent prompt with all sections described below"
}

RULES:
- Respond with ONLY the JSON object — no markdown, no code fences, no extra text.`,
    })
    text = result.text
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return Response.json({ error: "Failed to generate response from AI", details: errorMsg }, { status: 500 })
  }

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
