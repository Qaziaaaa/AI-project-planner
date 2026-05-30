"use client"

import { useState } from "react"
import { EditableSection } from "./editable-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Layers, Plus, Trash2 } from "lucide-react"
import type { BuildPhase } from "@/lib/types"

interface PhasesSectionProps {
  phases: BuildPhase[]
  onUpdate: (phases: BuildPhase[]) => void
}

function PhaseEditor({ phase, index, onChange, onRemove }: {
  phase: BuildPhase; index: number
  onChange: (i: number, p: BuildPhase) => void
  onRemove: (i: number) => void
}) {
  const addTask = () => onChange(index, { ...phase, tasks: [...phase.tasks, ""] })

  return (
    <div className="rounded-xl border border-border/20 bg-background/30 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary font-heading italic">{index + 1}</span>
        <Input value={phase.phase} onChange={(e) => onChange(index, { ...phase, phase: e.target.value })}
          placeholder="Phase name" className="h-9 flex-1 text-base font-medium bg-background/40 rounded-xl" />
        <Input value={phase.duration} onChange={(e) => onChange(index, { ...phase, duration: e.target.value })}
          placeholder="Duration" className="h-9 w-28 text-sm bg-background/40 rounded-xl" />
        <Button variant="ghost" size="icon-sm" onClick={() => onRemove(index)}>
          <Trash2 className="size-4 text-destructive/50" />
        </Button>
      </div>
      <div className="ml-10 space-y-2">
        {phase.tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground/30">—</span>
            <Textarea value={task} onChange={(e) => {
              const tasks = phase.tasks.map((t, j) => j === i ? e.target.value : t)
              onChange(index, { ...phase, tasks })
            }} placeholder="Task" className="min-h-[36px] text-sm flex-1 py-1.5 bg-background/30 rounded-xl" />
            <Button variant="ghost" size="icon-xs" onClick={() => {
              const tasks = phase.tasks.filter((_, j) => j !== i)
              onChange(index, { ...phase, tasks })
            }}>
              <Trash2 className="size-3.5 text-destructive/40" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="xs" onClick={addTask} className="gap-1.5 border-border/20 rounded-xl">
          <Plus className="size-3.5" /> Task
        </Button>
      </div>
    </div>
  )
}

export function PhasesSection({ phases, onUpdate }: PhasesSectionProps) {
  const [editPhases, setEditPhases] = useState<BuildPhase[]>(phases)

  return (
    <EditableSection title="Build Phases" icon={<Layers className="size-4" />}
      editor={
        <div className="space-y-3">
          {editPhases.map((p, i) => (
            <PhaseEditor key={i} phase={p} index={i}
              onChange={(i, phase) => setEditPhases(editPhases.map((e, j) => j === i ? phase : e))}
              onRemove={(i) => setEditPhases(editPhases.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="sm" onClick={() => setEditPhases([...editPhases, { phase: "", tasks: [], duration: "" }])}
            className="gap-2 border-border/20 rounded-xl">
            <Plus className="size-4" /> Add Phase
          </Button>
        </div>
      }
      onSave={() => onUpdate(editPhases)}
      onEdit={() => setEditPhases(phases.map(p => ({ ...p, tasks: [...p.tasks] })))}
      onCancel={() => setEditPhases(phases.map(p => ({ ...p, tasks: [...p.tasks] })))}
    >
      <div className="space-y-1">
        {phases.map((p, i) => (
          <div key={i} className="flex gap-5">
            <div className="flex flex-col items-center">
              <span className="decorative-number">{i + 1}</span>
              {i < phases.length - 1 && <div className="mt-1 w-px flex-1 bg-gradient-to-b from-border/30 to-transparent" />}
            </div>
            <div className="flex-1 pb-6 pt-0.5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-foreground/85">{p.phase}</span>
                <span className="text-xs text-muted-foreground/50 border border-border/15 rounded-lg px-2 py-0.5 font-mono">{p.duration}</span>
              </div>
              <ul className="space-y-2">
                {p.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground/60 leading-relaxed">
                    <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-muted-foreground/15 ring-1 ring-muted-foreground/20" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
