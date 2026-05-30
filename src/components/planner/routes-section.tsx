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
    <div className="rounded-xl border border-border/20 bg-background/30 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <code className="rounded-lg bg-primary/8 text-primary/70 px-2 py-1 text-sm font-mono font-medium">{route.path || "/path"}</code>
        <Input value={route.path} onChange={(e) => onChange(index, { ...route, path: e.target.value })}
          placeholder="/path" className="h-9 w-36 text-sm font-mono bg-background/40 rounded-xl" />
        <Input value={route.name} onChange={(e) => onChange(index, { ...route, name: e.target.value })}
          placeholder="Page name" className="h-9 flex-1 text-base bg-background/40 rounded-xl" />
        <Button variant="ghost" size="icon-sm" onClick={() => onRemove(index)}>
          <Trash2 className="size-4 text-destructive/50" />
        </Button>
      </div>
      <Textarea value={route.description} onChange={(e) => onChange(index, { ...route, description: e.target.value })}
        placeholder="Description" className="min-h-[70px] text-sm bg-background/30 rounded-xl" />
    </div>
  )
}

export function RoutesSection({ pages, onUpdate }: RoutesSectionProps) {
  const [editPages, setEditPages] = useState<Route[]>(pages)

  return (
    <EditableSection title="Pages / Routes" icon={<Map className="size-4" />}
      editor={
        <div className="space-y-3">
          {editPages.map((p, i) => (
            <RouteEditor key={i} route={p} index={i}
              onChange={(i, r) => setEditPages(editPages.map((e, j) => j === i ? r : e))}
              onRemove={(i) => setEditPages(editPages.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="sm" onClick={() => setEditPages([...editPages, { path: "/", name: "", description: "" }])}
            className="gap-2 border-border/20 rounded-xl">
            <Plus className="size-4" /> Add Route
          </Button>
        </div>
      }
      onSave={() => onUpdate(editPages)}
      onEdit={() => setEditPages([...pages])}
      onCancel={() => setEditPages([...pages])}
    >
      <div className="space-y-2">
        {pages.map((p, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-border/15 bg-muted/15 px-5 py-4">
            <code className="mt-0.5 shrink-0 rounded-lg bg-primary/8 text-primary/70 px-2.5 py-1 text-sm font-mono font-medium">
              {p.path}
            </code>
            <div className="min-w-0 space-y-1">
              <p className="text-base font-medium text-foreground/85">{p.name}</p>
              <p className="text-sm text-muted-foreground/65 leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </EditableSection>
  )
}
