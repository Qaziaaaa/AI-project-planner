import type { ProjectBrief } from "./types"

export function briefToMarkdown(brief: ProjectBrief): string {
  const lines: string[] = []

  lines.push("# Project Brief\n")

  lines.push("## App Summary")
  lines.push(brief.summary)
  lines.push("")

  lines.push("## Target Users")
  lines.push(brief.targetUsers)
  lines.push("")

  lines.push("## Core Features")
  brief.coreFeatures.forEach((f) => {
    lines.push(`- **${f.name}** (${f.priority}) — ${f.description}`)
  })
  lines.push("")

  lines.push("## Tech Stack")
  brief.techStack.forEach((t) => {
    lines.push(`- **${t.category}**: ${t.items.join(", ")}`)
  })
  lines.push("")

  lines.push("## Pages / Routes")
  brief.pages.forEach((p) => {
    lines.push(`- \`${p.path}\` — **${p.name}** — ${p.description}`)
  })
  lines.push("")

  lines.push("## Data Model")
  brief.dataModel.forEach((e) => {
    lines.push(`- **${e.name}** (\`${e.id}\`)`)
    e.attributes.forEach((a) => {
      lines.push(`  - ${a.name}: ${a.type}`)
    })
    e.relationships.forEach((r) => {
      lines.push(`  - → ${r.targetId} (${r.type})`)
    })
  })
  lines.push("")

  lines.push("## Build Phases")
  brief.buildPhases.forEach((p) => {
    lines.push(`- **${p.phase}** (${p.duration})`)
    p.tasks.forEach((t) => {
      lines.push(`  - ${t}`)
    })
  })
  lines.push("")

  lines.push("## Risks & Edge Cases")
  brief.risks.forEach((r) => {
    lines.push(`- **${r.risk}** (${r.severity})`)
    lines.push(`  - Mitigation: ${r.mitigation}`)
  })
  lines.push("")

  lines.push("## Starter Prompt")
  lines.push("```")
  lines.push(brief.starterPrompt)
  lines.push("```")
  lines.push("")

  return lines.join("\n")
}

export function downloadMarkdown(brief: ProjectBrief) {
  const md = briefToMarkdown(brief)
  const blob = new Blob([md], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "project-brief.md"
  a.click()
  URL.revokeObjectURL(url)
}
