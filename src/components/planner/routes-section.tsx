"use client"

import { useState } from "react"
import { EditableSection } from "./editable-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Map, Plus, Trash2 } from "lucide-react"
import type { Route } from "@/lib/types"

interface RoutesSectionProps {
  pages: Route[]
  onUpdate: (pages: Route[]) => void
}

function RouteEditor({ route, index, onChange, onRemove }: {
  route: Route; index: number
  onChange: (i: number, r: Route) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="rounded-lg border border-border/30 bg-card p-3.5 space-y-2.5 shadow-subtle">
      <div className="flex items-center gap-2.5">
        <Input value={route.path} onChange={(e) => onChange(index, { ...route, path: e.target.value })}
          placeholder="/path" className="h-8 w-28 text-xs font-mono bg-background/40 rounded-lg" />
        <Input value={route.name} onChange={(e) => onChange(index, { ...route, name: e.target.value })}
          placeholder="Page name" className="h-8 flex-1 text-sm bg-background/40 rounded-lg" />
        <Button variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
          <Trash2 className="size-3.5 text-destructive/50" />
        </Button>
      </div>
      <Textarea value={route.description} onChange={(e) => onChange(index, { ...route, description: e.target.value })}
        placeholder="Description" className="min-h-[60px] text-xs bg-background/30 rounded-lg" />
    </div>
  )
}

export function RoutesSection({ pages, onUpdate }: RoutesSectionProps) {
  const [editPages, setEditPages] = useState<Route[]>(pages)

  return (
    <EditableSection title="Pages / Routes" icon={<Map className="size-4" />}
      editor={
        <div className="space-y-2.5">
          {editPages.map((p, i) => (
            <RouteEditor key={i} route={p} index={i}
              onChange={(i, r) => setEditPages(editPages.map((e, j) => j === i ? r : e))}
              onRemove={(i) => setEditPages(editPages.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="xs" onClick={() => setEditPages([...editPages, { path: "/", name: "", description: "" }])}
            className="gap-1.5 border-border/30 rounded-lg text-xs">
            <Plus className="size-3.5" /> Add Route
          </Button>
        </div>
      }
      onSave={() => onUpdate(editPages)}
      onEdit={() => setEditPages([...pages])}
      onCancel={() => setEditPages([...pages])}
    >
      <div className="space-y-1.5">
        {pages.map((p, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border/30 bg-card px-4 py-3 shadow-subtle">
            <code className="mt-0.5 shrink-0 rounded-md bg-primary/8 text-primary/70 px-2 py-0.5 text-xs font-mono font-medium">
              {p.path}
            </code>
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium text-foreground/85">{p.name}</p>
              <p className="text-xs text-muted-foreground/65 leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
