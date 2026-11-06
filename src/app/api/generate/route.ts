const BACKEND_URL =
  process.env.BRIEFKIT_BACKEND_URL || "http://localhost:8001/api/generate-stream"

export async function POST(req: Request) {
  let idea: unknown
  try {
    ;({ idea } = await req.json())
  } catch {
    idea = undefined
  }

  if (!idea || typeof idea !== "string") {
    return Response.json({ error: "Idea is required" }, { status: 400 })
  }

  if (idea.trim().length < 5) {
    return Response.json(
      {
        error: "short-input",
        message: "Please describe your idea in at least a few words.",
      },
      { status: 400 }
    )
  }

  let upstream: Response
  try {
    upstream = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
      signal: req.signal,
    })
  } catch {
    return Response.json(
      {
        error: "Backend unreachable",
        details:
          "Start the Python backend: cd backend && venv/bin/uvicorn main:app --port 8001",
      },
      { status: 502 }
    )
  }

  const contentType = upstream.headers.get("content-type") || ""

  // Backend returned a plain JSON error (validation/config) — forward as-is
  if (contentType.includes("application/json") && !upstream.ok) {
    let data: Record<string, unknown> = {}
    try {
      data = await upstream.json()
    } catch {
      data = { error: `Backend error (status ${upstream.status})` }
    }
    return Response.json(data, { status: upstream.status })
  }

  // Stream SSE (or any body) straight through to the client
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": contentType.includes("json")
        ? contentType
        : "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
