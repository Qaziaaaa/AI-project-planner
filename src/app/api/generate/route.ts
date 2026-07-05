import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

const featureSchema = z.object({
  name: z.string(),
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
})

const techItemSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
})

const routeSchema = z.object({
  path: z.string(),
  name: z.string(),
  description: z.string(),
})

const attributeSchema = z.object({
  name: z.string(),
  type: z.string(),
})

const relationshipSchema = z.object({
  targetId: z.string(),
  type: z.string(),
})

const dataEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  attributes: z.array(attributeSchema),
  relationships: z.array(relationshipSchema),
})

const buildPhaseSchema = z.object({
  phase: z.string(),
  tasks: z.array(z.string()),
  duration: z.string(),
})

const riskSchema = z.object({
  risk: z.string(),
  mitigation: z.string(),
  severity: z.enum(["high", "medium", "low"]),
})

const briefSchema = z.object({
  summary: z.string(),
  targetUsers: z.string(),
  coreFeatures: z.array(featureSchema),
  techStack: z.array(techItemSchema),
  pages: z.array(routeSchema),
  dataModel: z.array(dataEntitySchema),
  buildPhases: z.array(buildPhaseSchema),
  risks: z.array(riskSchema),
  starterPrompt: z.string(),
})

export async function POST(req: Request) {
  const { idea } = await req.json()

  if (!idea || typeof idea !== "string") {
    return Response.json({ error: "Idea is required" }, { status: 400 })
  }

  const model = openrouter("openai/gpt-4o-mini")

  const { object } = await generateObject({
    model,
    schema: briefSchema,
    prompt: `You are an expert software engineering consultant. Given a rough app idea, produce a detailed project brief.

App idea: "${idea}"

Return a complete JSON project brief covering:
- summary: 2-3 sentence summary
- targetUsers: who this is for
- coreFeatures: 4-8 features each with name, description, priority (high/medium/low)
- techStack: 4-6 categories (frontend, backend, database, hosting, etc.) each with specific items
- pages: 4-8 routes with path, name, description
- dataModel: 3-6 entities with id (kebab-case), name, attributes (name + type), relationships (targetId + type)
- buildPhases: 3-5 phases with name, tasks array, duration
- risks: 2-4 risks with risk, mitigation, severity (high/medium/low)
- starterPrompt: a comprehensive, production-ready prompt for a coding agent (see format below)

The starterPrompt must be a detailed, structured prompt following this format exactly:

You are a senior developer implementing [app name]. Build a production-quality MVP.

PROJECT OVERVIEW
One paragraph summarizing the app.

TECH STACK
- Frontend: [specific framework/lib choices]
- Backend: [specific choices]
- Database: [specific choices]
- Other: [specific choices]

CORE FEATURES
- [Feature 1]: brief description
- [Feature 2]: brief description
- (continue for all features)

DATA MODEL
- [Entity 1]: [attribute: type], [attribute: type] — relationships
- [Entity 2]: [attribute: type], [attribute: type] — relationships
- (continue for all entities)

PAGES / ROUTES
- /path → Page Name: description
- (continue for all pages)

IMPLEMENTATION ORDER
1. Phase 1 (duration): key tasks
2. Phase 2 (duration): key tasks
(continue for all phases)

EDGE CASES & NOTES
- [Edge case 1]: mitigation
- [Edge case 2]: mitigation

CODING STANDARDS
- Use TypeScript strict mode throughout
- Handle loading and error states in every component
- Add proper input validation and sanitization
- Use semantic HTML and accessible patterns
- Write clean, commented code

Be concrete and realistic. List specific library names, real database fields, and actual file paths where relevant.`,
  })

  return Response.json(object)
}
