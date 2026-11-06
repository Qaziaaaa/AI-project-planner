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

  // Using deepseek/deepseek-chat for fast, professional PM reasoning & structured JSON
  const model = openrouter("deepseek/deepseek-chat")

  let text: string
  try {
    const result = await generateText({
      model,
      temperature: 0.4,
      prompt: `You are a Principal Technical Product Manager and Senior AI Solution Architect. Your job is to take a rough project idea and turn it into an elite, comprehensive, enterprise-grade project brief.

Read this project idea: """${idea}"""

Produce a JSON object with EXACTLY the following structure (do not omit any fields):

{
  "projectType": "the specific technical architecture type (e.g. Next.js SaaS, Python CLI, React Native App)",
  "summary": "3-4 sentence executive summary detailing what this project does, target business value, and technical differentiator.",
  "targetUsers": "Detailed user personas — roles, technical skill level, core workflows, and success metrics.",
  "coreFeatures": [
    {
      "name": "Feature Name",
      "description": "What it does and why it matters",
      "priority": "high|medium|low",
      "acceptanceCriteria": ["Given X, When Y, Then Z", "Specific testable condition"]
    }
  ],
  "techStack": [
    {
      "category": "Frontend|Backend|Database|DevOps|AI",
      "items": ["Specific technology choice with version"],
      "rationale": "Why this specific choice was made over alternatives"
    }
  ],
  "pages": [
    {
      "path": "/url-path",
      "name": "Page Name",
      "description": "Component tree, data fetching strategy, and state management for this page"
    }
  ],
  "dataModel": [
    {
      "id": "entity-id",
      "name": "Entity Name",
      "attributes": [{"name": "field_name", "type": "String|Int|Boolean|DateTime|UUID"}],
      "relationships": [{"targetId": "other-entity", "type": "one-to-many|many-to-many|one-to-one"}]
    }
  ],
  "buildPhases": [
    {
      "phase": "Phase Name (e.g. Phase 1: Core Foundation)",
      "tasks": ["Specific actionable engineering task with file paths"],
      "duration": "1 week"
    }
  ],
  "risks": [
    {
      "risk": "Specific technical or product risk",
      "mitigation": "Concrete architectural or operational mitigation",
      "severity": "high|medium|low"
    }
  ],
  "costEstimate": {
    "hosting": { "service": "Vercel / AWS", "tier": "Hobby / Pro", "estimatedCost": "$20/mo" },
    "database": { "service": "Supabase / Neon", "tier": "Free / Pro", "estimatedCost": "$25/mo" },
    "thirdPartyServices": [
      { "service": "OpenAI / OpenRouter API", "tier": "Pay-as-you-go", "estimatedCost": "$15/mo" }
    ],
    "totalEstimatedMonthly": "$60/mo"
  },
  "securityChecklist": [
    {
      "category": "Auth|Data|Network|Compliance",
      "requirement": "Specific security requirement",
      "recommendation": "Implementation guideline (e.g. bcrypt hash, rate limiting via Redis)"
    }
  ],
  "codeScaffolding": {
    "fileTree": "src/\\n  app/\\n    layout.tsx\\n    page.tsx\\n  components/\\n    ui/\\npackage.json\\ntsconfig.json",
    "initialConfigs": [
      { "filename": "package.json", "content": "{\\n  \"name\": \"project\",\\n  \"version\": \"1.0.0\"\\n}" },
      { "filename": ".env.example", "content": "DATABASE_URL=postgres://...\\nAPI_KEY=..." }
    ]
  },
  "starterPrompt": "a comprehensive, production-ready coding agent prompt with all 11 sections described below (OVERVIEW, TECH STACK, ARCHITECTURE, CORE FEATURES, DATA MODEL, API ENDPOINTS, PAGES, IMPLEMENTATION ORDER, EDGE CASES, TESTING, CODING STANDARDS). Minimum 400 words with exact file paths."
}

RULES:
- Be extremely specific to THIS project. No generic filler.
- Respond with ONLY the raw JSON object — no markdown formatting, no code fences, no extra text.`,
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
