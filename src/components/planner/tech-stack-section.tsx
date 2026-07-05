"use client"

import { useState } from "react"
import { EditableSection } from "./editable-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wrench, Plus, Trash2 } from "lucide-react"
import type { TechItem } from "@/lib/types"

interface TechStackSectionProps {
  techStack: TechItem[]
  onUpdate: (techStack: TechItem[]) => void
}

function StackEditor({ item, index, onChange, onRemove }: {
  item: TechItem; index: number
  onChange: (i: number, item: TechItem) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border/30 bg-card p-3.5 shadow-subtle">
      <div className="flex-1 space-y-2">
        <Input value={item.category} onChange={(e) => onChange(index, { ...item, category: e.target.value })}
          placeholder="Category" className="h-8 text-sm font-medium bg-background/40 rounded-lg" />
        <Input value={item.items.join(", ")} onChange={(e) => onChange(index, { ...item, items: e.target.value.split(",").map(s => s.trim()) })}
          placeholder="Items (comma-separated)" className="h-8 text-xs bg-background/40 rounded-lg" />
      </div>
      <Button variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
        <Trash2 className="size-3.5 text-destructive/50" />
      </Button>
    </div>
  )
}

export function TechStackSection({ techStack, onUpdate }: TechStackSectionProps) {
  const [editStack, setEditStack] = useState<TechItem[]>(techStack)

  return (
    <EditableSection title="Tech Stack" icon={<Wrench className="size-4" />}
      editor={
        <div className="space-y-2.5">
          {editStack.map((s, i) => (
            <StackEditor key={i} item={s} index={i}
              onChange={(i, item) => setEditStack(editStack.map((e, j) => j === i ? item : e))}
              onRemove={(i) => setEditStack(editStack.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="xs" onClick={() => setEditStack([...editStack, { category: "", items: [] }])}
            className="gap-1.5 border-border/30 rounded-lg text-xs">
            <Plus className="size-3.5" /> Add Category
          </Button>
        </div>
      }
      onSave={() => onUpdate(editStack)}
      onEdit={() => setEditStack([...techStack])}
      onCancel={() => setEditStack([...techStack])}
    >
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {techStack.map((s, i) => (
          <div key={i} className="rounded-lg border border-border/30 bg-card px-3.5 py-3 space-y-2 shadow-subtle">
            <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">{s.category}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.items.map((item, j) => (
                <span key={j} className="inline-flex rounded-md border border-border/15 bg-background/60 px-2 py-0.5 text-[11px] font-medium text-foreground/65">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
