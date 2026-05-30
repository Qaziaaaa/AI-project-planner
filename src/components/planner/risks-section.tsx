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
  high: "bg-red-500/8 text-red-500 border-red-500/15",
  medium: "bg-yellow-500/8 text-yellow-600 border-yellow-500/15",
  low: "bg-green-500/8 text-green-600 border-green-500/15",
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
    <div className="rounded-xl border border-border/20 bg-background/30 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Input value={risk.risk} onChange={(e) => onChange(index, { ...risk, risk: e.target.value })}
          placeholder="Risk" className="h-9 flex-1 text-base bg-background/40 rounded-xl" />
        <select value={risk.severity}
          onChange={(e) => onChange(index, { ...risk, severity: e.target.value as Risk["severity"] })}
          className="h-9 rounded-xl border border-border/20 bg-background/40 px-3 text-sm text-muted-foreground">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button variant="ghost" size="icon-sm" onClick={() => onRemove(index)}>
          <Trash2 className="size-4 text-destructive/50" />
        </Button>
      </div>
      <Textarea value={risk.mitigation} onChange={(e) => onChange(index, { ...risk, mitigation: e.target.value })}
        placeholder="Mitigation strategy" className="min-h-[70px] text-sm bg-background/30 rounded-xl" />
    </div>
  )
}

export function RisksSection({ risks, onUpdate }: RisksSectionProps) {
  const [editRisks, setEditRisks] = useState<Risk[]>(risks)

  return (
    <EditableSection title="Risks & Edge Cases" icon={<AlertTriangle className="size-4" />}
      editor={
        <div className="space-y-3">
          {editRisks.map((r, i) => (
            <RiskEditor key={i} risk={r} index={i}
              onChange={(i, r) => setEditRisks(editRisks.map((e, j) => j === i ? r : e))}
              onRemove={(i) => setEditRisks(editRisks.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="sm" onClick={() => setEditRisks([...editRisks, { risk: "", mitigation: "", severity: "medium" }])}
            className="gap-2 border-border/20 rounded-xl">
            <Plus className="size-4" /> Add Risk
          </Button>
        </div>
      }
      onSave={() => onUpdate(editRisks)}
      onEdit={() => setEditRisks([...risks])}
      onCancel={() => setEditRisks([...risks])}
    >
      <div className="space-y-3">
        {risks.map((r, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-border/15 bg-muted/15 px-5 py-4">
            <span className="mt-0.5 flex size-2 shrink-0 rounded-full bg-destructive/25" />
            <div className="min-w-0 space-y-1.5 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-base font-medium text-foreground/85">{r.risk}</span>
                <Badge className={`text-[10px] px-2 py-0.5 border ${severityColors[r.severity]}`}>{r.severity}</Badge>
              </div>
              <p className="text-sm text-muted-foreground/65 leading-relaxed">
                <span className="font-medium text-foreground/55">Mitigation: </span>{r.mitigation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
