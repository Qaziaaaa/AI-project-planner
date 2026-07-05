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
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-primary/10 text-primary border-primary/20",
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
    <div className="rounded-lg border border-border/30 bg-card p-3.5 space-y-2.5 shadow-subtle">
      <div className="flex items-center gap-2.5">
        <Input value={feature.name} onChange={(e) => onChange(index, { ...feature, name: e.target.value })}
          placeholder="Feature name" className="h-8 text-sm flex-1 bg-background/40 rounded-lg" />
        <select value={feature.priority}
          onChange={(e) => onChange(index, { ...feature, priority: e.target.value as Feature["priority"] })}
          className="h-8 rounded-lg border border-border/20 bg-background/40 px-2.5 text-xs text-muted-foreground">
          <option value="high">High</option>
          <option value="medium">Med</option>
          <option value="low">Low</option>
        </select>
        <Button variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
          <Trash2 className="size-3.5 text-destructive/50" />
        </Button>
      </div>
      <Textarea value={feature.description} onChange={(e) => onChange(index, { ...feature, description: e.target.value })}
        placeholder="Description" className="min-h-[60px] text-xs bg-background/30 rounded-lg" />
    </div>
  )
}

export function FeaturesSection({ features, onUpdate }: FeaturesSectionProps) {
  const [editFeatures, setEditFeatures] = useState<Feature[]>(features)

  return (
    <EditableSection title="Core Features" icon={<ListChecks className="size-4" />}
      editor={
        <div className="space-y-2.5">
          {editFeatures.map((f, i) => (
            <FeatureEditor key={i} feature={f} index={i}
              onChange={(i, f) => setEditFeatures(editFeatures.map((e, j) => j === i ? f : e))}
              onRemove={(i) => setEditFeatures(editFeatures.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="xs" onClick={() => setEditFeatures([...editFeatures, { name: "", description: "", priority: "medium" }])}
            className="gap-1.5 border-border/30 rounded-lg text-xs">
            <Plus className="size-3.5" /> Add Feature
          </Button>
        </div>
      }
      onSave={() => onUpdate(editFeatures)}
      onEdit={() => setEditFeatures([...features])}
      onCancel={() => setEditFeatures([...features])}
    >
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border/30 bg-card px-4 py-3 shadow-subtle">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/40" />
            <div className="min-w-0 space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground/85">{f.name}</span>
                <Badge className={`text-[10px] px-1.5 py-0 border ${priorityColors[f.priority]}`}>{f.priority}</Badge>
              </div>
              <p className="text-xs text-muted-foreground/65 leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
