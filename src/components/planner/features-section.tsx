"use client"

import { useState } from "react"
import { EditableSection } from "./editable-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ListChecks, Plus, Trash2 } from "lucide-react"
import type { Feature } from "@/lib/types"

const priorityColors: Record<string, string> = {
  high: "bg-red-500/8 text-red-500 border-red-500/15",
  medium: "bg-sky-500/8 text-sky-500 border-sky-500/15",
  low: "bg-zinc-500/8 text-zinc-500 border-zinc-500/15",
}

interface FeaturesSectionProps {
  features: Feature[]
  onUpdate: (features: Feature[]) => void
}

function FeatureEditor({ feature, index, onChange, onRemove }: {
  feature: Feature; index: number
  onChange: (i: number, f: Feature) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="rounded-xl border border-border/20 bg-background/30 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Input value={feature.name} onChange={(e) => onChange(index, { ...feature, name: e.target.value })}
          placeholder="Feature name" className="h-9 text-base flex-1 bg-background/40 rounded-xl" />
        <select value={feature.priority}
          onChange={(e) => onChange(index, { ...feature, priority: e.target.value as Feature["priority"] })}
          className="h-9 rounded-xl border border-border/20 bg-background/40 px-3 text-sm text-muted-foreground">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button variant="ghost" size="icon-sm" onClick={() => onRemove(index)}>
          <Trash2 className="size-4 text-destructive/50" />
        </Button>
      </div>
      <Textarea value={feature.description} onChange={(e) => onChange(index, { ...feature, description: e.target.value })}
        placeholder="Description" className="min-h-[70px] text-sm bg-background/30 rounded-xl" />
    </div>
  )
}

export function FeaturesSection({ features, onUpdate }: FeaturesSectionProps) {
  const [editFeatures, setEditFeatures] = useState<Feature[]>(features)

  return (
    <EditableSection title="Core Features" icon={<ListChecks className="size-4" />}
      editor={
        <div className="space-y-3">
          {editFeatures.map((f, i) => (
            <FeatureEditor key={i} feature={f} index={i}
              onChange={(i, f) => setEditFeatures(editFeatures.map((e, j) => j === i ? f : e))}
              onRemove={(i) => setEditFeatures(editFeatures.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="sm" onClick={() => setEditFeatures([...editFeatures, { name: "", description: "", priority: "medium" }])}
            className="gap-2 border-border/20 rounded-xl">
            <Plus className="size-4" /> Add Feature
          </Button>
        </div>
      }
      onSave={() => onUpdate(editFeatures)}
      onEdit={() => setEditFeatures([...features])}
      onCancel={() => setEditFeatures([...features])}
    >
      <div className="space-y-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-border/15 bg-muted/15 px-5 py-4">
            <span className="mt-0.5 flex size-2 shrink-0 rounded-full bg-primary/30" />
            <div className="min-w-0 space-y-1.5 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-base font-medium text-foreground/85">{f.name}</span>
                <Badge className={`text-[10px] px-2 py-0.5 border ${priorityColors[f.priority]}`}>{f.priority}</Badge>
              </div>
              <p className="text-sm text-muted-foreground/65 leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
