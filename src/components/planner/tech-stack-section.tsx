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
    <div className="flex items-start gap-3 rounded-xl border border-border/20 bg-background/30 p-4">
      <div className="flex-1 space-y-2">
        <Input value={item.category} onChange={(e) => onChange(index, { ...item, category: e.target.value })}
          placeholder="Category (e.g. Frontend)" className="h-9 text-base font-medium bg-background/40 rounded-xl" />
        <Input value={item.items.join(", ")} onChange={(e) => onChange(index, { ...item, items: e.target.value.split(",").map(s => s.trim()) })}
          placeholder="Items (comma-separated)" className="h-9 text-sm bg-background/40 rounded-xl" />
      </div>
      <Button variant="ghost" size="icon-sm" onClick={() => onRemove(index)}>
        <Trash2 className="size-4 text-destructive/50" />
      </Button>
    </div>
  )
}

export function TechStackSection({ techStack, onUpdate }: TechStackSectionProps) {
  const [editStack, setEditStack] = useState<TechItem[]>(techStack)

  return (
    <EditableSection title="Tech Stack" icon={<Wrench className="size-4" />}
      editor={
        <div className="space-y-3">
          {editStack.map((s, i) => (
            <StackEditor key={i} item={s} index={i}
              onChange={(i, item) => setEditStack(editStack.map((e, j) => j === i ? item : e))}
              onRemove={(i) => setEditStack(editStack.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="sm" onClick={() => setEditStack([...editStack, { category: "", items: [] }])}
            className="gap-2 border-border/20 rounded-xl">
            <Plus className="size-4" /> Add Category
          </Button>
        </div>
      }
      onSave={() => onUpdate(editStack)}
      onEdit={() => setEditStack([...techStack])}
      onCancel={() => setEditStack([...techStack])}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {techStack.map((s, i) => (
          <div key={i} className="rounded-xl border border-border/15 bg-muted/15 px-4 py-3.5 space-y-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-[0.15em] font-mono">{s.category}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.items.map((item, j) => (
                <span key={j} className="inline-flex rounded-lg border border-border/15 bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground/65">
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
