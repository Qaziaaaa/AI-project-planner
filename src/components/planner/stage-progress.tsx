import { Check, Loader2 } from "lucide-react"

export type StageStatus = "pending" | "active" | "done"

export interface StageState {
  label: string
  status: StageStatus
  token: string
}

export const STAGE_LABELS = [
  "Interrogating idea",
  "Scoping & PM analysis",
  "Designing architecture",
  "Risk, cost & security review",
  "Synthesizing brief",
] as const

export function initialStages(): StageState[] {
  return STAGE_LABELS.map((label) => ({ label, status: "pending", token: "" }))
}

export function StageProgress({ stages }: { stages: StageState[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 shadow-card space-y-4 animate-fade-in-up">
      {stages.map((s, i) => (
        <div key={s.label} className="flex items-start gap-3">
          <div
            className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-medium ${
              s.status === "done"
                ? "border-primary/40 bg-primary/15 text-primary"
                : s.status === "active"
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 bg-muted/40 text-muted-foreground/50"
            }`}
          >
            {s.status === "done" ? (
              <Check className="size-4" />
            ) : s.status === "active" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              i + 1
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-sm font-medium ${
                s.status === "pending" ? "text-muted-foreground/40" : "text-foreground/85"
              }`}
            >
              {s.label}
            </div>
            {s.status === "active" && s.token && (
              <div className="mt-1 truncate font-mono text-xs text-muted-foreground/70">
                {s.token}
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="border-t border-border/40 pt-3 text-[11px] uppercase tracking-wider text-muted-foreground/50">
        Senior PM pipeline · 5 specialist agents
      </div>
    </div>
  )
}
