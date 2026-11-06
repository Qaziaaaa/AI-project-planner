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

  // Using deepseek/deepseek-chat with strict token limit for lightning-fast response times
  const model = openrouter("deepseek/deepseek-chat")

  let text: string
  try {
    const result = await generateText({
      model,
      temperature: 0.3,
      maxOutputTokens: 4096,
      prompt: `You are a Principal Technical Product Manager and Senior AI Solution Architect. Transform this project idea into a complete, elite project brief JSON:

Idea: "${idea}"

Return ONLY a valid JSON object with this exact structure (no markdown fences, no extra text):
{
  "projectType": "architecture type",
  "summary": "3 sentence executive summary",
  "targetUsers": "detailed user personas and workflows",
  "coreFeatures": [{"name": "string", "description": "string", "priority": "high|medium|low", "acceptanceCriteria": ["Given X, When Y, Then Z"]}],
  "techStack": [{"category": "Frontend|Backend|Database|DevOps", "items": ["string"], "rationale": "string"}],
  "pages": [{"path": "string", "name": "string", "description": "string"}],
  "dataModel": [{"id": "string", "name": "string", "attributes": [{"name": "string", "type": "string"}], "relationships": [{"targetId": "string", "type": "string"}]}],
  "buildPhases": [{"phase": "string", "tasks": ["string"], "duration": "string"}],
  "risks": [{"risk": "string", "mitigation": "string", "severity": "high|medium|low"}],
  "costEstimate": {
    "hosting": { "service": "string", "tier": "string", "estimatedCost": "string" },
    "database": { "service": "string", "tier": "string", "estimatedCost": "string" },
    "thirdPartyServices": [{"service": "string", "tier": "string", "estimatedCost": "string"}],
    "totalEstimatedMonthly": "string"
  },
  "securityChecklist": [{"category": "Auth|Data|Network|Compliance", "requirement": "string", "recommendation": "string"}],
  "codeScaffolding": {
    "fileTree": "src/\\n  app/\\n    page.tsx\\npackage.json",
    "initialConfigs": [{"filename": "package.json", "content": "{\\"name\\":\\"app\\"}"}]
  },
  "starterPrompt": "Comprehensive 400+ word coding agent prompt with all 11 sections (OVERVIEW, TECH STACK, ARCHITECTURE, CORE FEATURES, DATA MODEL, API ENDPOINTS, PAGES, IMPLEMENTATION ORDER, EDGE CASES, TESTING, CODING STANDARDS) with exact file paths."
}`,
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
