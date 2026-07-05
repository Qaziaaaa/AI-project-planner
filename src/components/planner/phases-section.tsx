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
    <div className="rounded-lg border border-border/30 bg-card p-3.5 space-y-2.5 shadow-subtle">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-bold text-secondary">{index + 1}</span>
        <Input value={phase.phase} onChange={(e) => onChange(index, { ...phase, phase: e.target.value })}
          placeholder="Phase name" className="h-8 flex-1 text-sm font-medium bg-background/40 rounded-lg" />
        <Input value={phase.duration} onChange={(e) => onChange(index, { ...phase, duration: e.target.value })}
          placeholder="Duration" className="h-8 w-24 text-xs bg-background/40 rounded-lg" />
        <Button variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
          <Trash2 className="size-3.5 text-destructive/50" />
        </Button>
      </div>
      <div className="ml-9 space-y-1.5">
        {phase.tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground/30">—</span>
            <Textarea value={task} onChange={(e) => {
              const tasks = phase.tasks.map((t, j) => j === i ? e.target.value : t)
              onChange(index, { ...phase, tasks })
            }} placeholder="Task" className="min-h-[30px] text-xs flex-1 py-1 bg-background/30 rounded-lg" />
            <Button variant="ghost" size="icon-xs" onClick={() => {
              const tasks = phase.tasks.filter((_, j) => j !== i)
              onChange(index, { ...phase, tasks })
            }}>
              <Trash2 className="size-3 text-destructive/40" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="xs" onClick={addTask} className="gap-1 border-border/30 rounded-lg text-[10px] h-6">
          <Plus className="size-3" /> Task
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
        <div className="space-y-2.5">
          {editPhases.map((p, i) => (
            <PhaseEditor key={i} phase={p} index={i}
              onChange={(i, phase) => setEditPhases(editPhases.map((e, j) => j === i ? phase : e))}
              onRemove={(i) => setEditPhases(editPhases.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="xs" onClick={() => setEditPhases([...editPhases, { phase: "", tasks: [], duration: "" }])}
            className="gap-1.5 border-border/30 rounded-lg text-xs">
            <Plus className="size-3.5" /> Add Phase
          </Button>
        </div>
      }
      onSave={() => onUpdate(editPhases)}
      onEdit={() => setEditPhases(phases.map(p => ({ ...p, tasks: [...p.tasks] })))}
      onCancel={() => setEditPhases(phases.map(p => ({ ...p, tasks: [...p.tasks] })))}
    >
      <div className="space-y-0">
        {phases.map((p, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-sm font-bold text-secondary">{i + 1}</span>
              {i < phases.length - 1 && <div className="mt-1 w-px flex-1 bg-gradient-to-b from-border/50 to-transparent" />}
            </div>
            <div className="flex-1 pb-5 pt-0.5 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-medium text-foreground/85">{p.phase}</span>
                <span className="text-[10px] text-muted-foreground/50 border border-border/15 rounded-md px-1.5 py-0.5 font-mono">{p.duration}</span>
              </div>
              <ul className="space-y-1.5">
                {p.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-xs text-muted-foreground/60 leading-relaxed">
                    <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-muted-foreground/20" />
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
