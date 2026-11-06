import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

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

  const apiKey = process.env.GROQ_API_KEY

  // If no API key is set, return a mock response for testing/demo purposes
  if (!apiKey) {
    console.warn("GROQ_API_KEY is missing. Returning a mock brief.")
    return Response.json({
      projectType: "Full-Stack Web Application (Demo Mode)",
      summary: `This is a mock project brief for "${idea}". To get real AI-generated briefs, please set GROQ_API_KEY in your .env.local file.`,
      targetUsers: "End users, Developers, Administrators",
      feedback: "GROQ_API_KEY environment variable is missing! Add GROQ_API_KEY=your_key to .env.local to enable real AI generation.",
      coreFeatures: [
        { name: "User Authentication", description: "Secure login and signup flow.", priority: "high" },
        { name: "Dashboard View", description: "Main overview of user activity and data.", priority: "high" },
        { name: "Settings & Profile", description: "Allow users to edit their profile and preferences.", priority: "medium" },
      ],
      techStack: [
        { category: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
        { category: "Backend", items: ["Next.js App Router", "TypeScript"] },
        { category: "Database", items: ["PostgreSQL", "Prisma"] },
      ],
      pages: [
        { path: "/", name: "Home", description: "Landing page and overview" },
        { path: "/dashboard", name: "Dashboard", description: "Main user workspace" },
      ],
      dataModel: [
        {
          id: "user",
          name: "User",
          attributes: [
            { name: "id", type: "String" },
            { name: "email", type: "String" },
            { name: "name", type: "String" },
          ],
          relationships: [],
        },
      ],
      buildPhases: [
        { phase: "Phase 1: Foundation", tasks: ["Project setup", "Authentication setup"], duration: "1 week" },
        { phase: "Phase 2: Core Features", tasks: ["Build dashboard", "Integrate data model"], duration: "2 weeks" },
      ],
      risks: [
        { risk: "API Key missing", mitigation: "Add GROQ_API_KEY to your .env.local file", severity: "high" },
      ],
      starterPrompt: `PROJECT OVERVIEW\nBuilding a mock application for: ${idea}.\n\nTECH STACK\nNext.js 16, React 19, Tailwind CSS v4, TypeScript.\n\nARCHITECTURE\nNext.js App Router with React Server Components.\n\nCORE FEATURES\n- Authentication\n- Dashboard\n- User Settings\n\nDATA MODEL\nUser model with basic profile attributes.\n\nIMPLEMENTATION ORDER\n1. Setup project\n2. Configure auth\n3. Build UI components\n\n(Note: Set GROQ_API_KEY in .env.local to get real AI-generated starter prompts!)`,
    })
  }

  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey,
  })

  const model = groq("llama-3.3-70b-versatile")

  let text: string
  try {
    const result = await generateText({
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
  "starterPrompt": "a comprehensive, production-ready coding agent prompt with all sections described below"
}

RULES:
- Choose a tech stack that actually fits the project. A game doesn't need Next.js. A CLI tool doesn't need a database. A design system doesn't need auth.
- Every field must be specific to THIS project. No generic filler.
- The starterPrompt is the most important field. It must be a real, copy-pasteable prompt a developer could hand to a coding agent to build the project. Structure it with these sections, each filled with concrete detail:

  PROJECT OVERVIEW — 2-3 paragraphs describing what to build, key constraints, target users, and success criteria.

  TECH STACK — Specific versions and rationale. Real packages, real libraries, real databases. Include config details (e.g. "Next.js 16 with App Router, Turbopack, TypeScript strict").

  ARCHITECTURE — High-level design decisions: monorepo vs single repo, API design patterns (REST, GraphQL, tRPC), state management approach, auth strategy.

  CORE FEATURES — Spec-level detail for each feature. Include acceptance criteria, component breakdown, data flow. E.g. "Feature: User sign-up. Acceptance: email+password form, OAuth options, email verification flow. Components: SignUpForm, OAuthButtons, EmailVerificationBanner."

  DATA MODEL — Complete schema with all fields, types, constraints, indexes, and relationships. Real SQL/Prisma/TypeORM schema format.

  API ENDPOINTS — Full route table: method, path, request body, response shape, auth requirements. Skip if not relevant.

  PAGES / ROUTES — URL structure with component tree for each page. Include loading states, error boundaries, data fetching strategy.

  IMPLEMENTATION ORDER — Phase-by-phase build plan with concrete file paths (e.g. src/app/page.tsx, src/components/auth/SignUpForm.tsx). Each phase must have specific, actionable tasks.

  EDGE CASES & NOTES — Error states, loading states, empty states, permission checks, rate limiting, pagination, offline support, optimistic updates.

  TESTING STRATEGY — What to test at each layer (unit, integration, e2e). Specific tools and patterns.

  CODING STANDARDS — Exact lint rules, naming conventions (camelCase, PascalCase), file structure, import ordering, error handling patterns, accessibility requirements.

- The starterPrompt should be at minimum 400 words. Be extremely concrete — mention actual file paths, component names, npm packages with versions, and database field types.
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
