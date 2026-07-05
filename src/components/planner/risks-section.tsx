"use client"

import { useState } from "react"
import { EditableSection } from "./editable-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Plus, Trash2 } from "lucide-react"
import type { Risk } from "@/lib/types"

const severityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-secondary/10 text-secondary border-secondary/20",
}

interface RisksSectionProps {
  risks: Risk[]
  onUpdate: (risks: Risk[]) => void
}

function RiskEditor({ risk, index, onChange, onRemove }: {
  risk: Risk; index: number
  onChange: (i: number, r: Risk) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="rounded-lg border border-border/30 bg-card p-3.5 space-y-2.5 shadow-subtle">
      <div className="flex items-center gap-2.5">
        <Input value={risk.risk} onChange={(e) => onChange(index, { ...risk, risk: e.target.value })}
          placeholder="Risk" className="h-8 flex-1 text-sm bg-background/40 rounded-lg" />
        <select value={risk.severity}
          onChange={(e) => onChange(index, { ...risk, severity: e.target.value as Risk["severity"] })}
          className="h-8 rounded-lg border border-border/20 bg-background/40 px-2.5 text-xs text-muted-foreground">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
          <Trash2 className="size-3.5 text-destructive/50" />
        </Button>
      </div>
      <Textarea value={risk.mitigation} onChange={(e) => onChange(index, { ...risk, mitigation: e.target.value })}
        placeholder="Mitigation strategy" className="min-h-[60px] text-xs bg-background/30 rounded-lg" />
    </div>
  )
}

export function RisksSection({ risks, onUpdate }: RisksSectionProps) {
  const [editRisks, setEditRisks] = useState<Risk[]>(risks)

  return (
    <EditableSection title="Risks & Edge Cases" icon={<AlertTriangle className="size-4" />}
      editor={
        <div className="space-y-2.5">
          {editRisks.map((r, i) => (
            <RiskEditor key={i} risk={r} index={i}
              onChange={(i, r) => setEditRisks(editRisks.map((e, j) => j === i ? r : e))}
              onRemove={(i) => setEditRisks(editRisks.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="xs" onClick={() => setEditRisks([...editRisks, { risk: "", mitigation: "", severity: "medium" }])}
            className="gap-1.5 border-border/30 rounded-lg text-xs">
            <Plus className="size-3.5" /> Add Risk
          </Button>
        </div>
      }
      onSave={() => onUpdate(editRisks)}
      onEdit={() => setEditRisks([...risks])}
      onCancel={() => setEditRisks([...risks])}
    >
      <div className="space-y-2">
        {risks.map((r, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border/30 bg-card px-4 py-3 shadow-subtle">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-destructive/30" />
            <div className="min-w-0 space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground/85">{r.risk}</span>
                <Badge className={`text-[10px] px-1.5 py-0 border ${severityColors[r.severity]}`}>{r.severity}</Badge>
              </div>
              <p className="text-xs text-muted-foreground/65 leading-relaxed">
                <span className="font-medium text-foreground/55">Mitigation: </span>{r.mitigation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
