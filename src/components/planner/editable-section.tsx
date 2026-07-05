"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, X, Check } from "lucide-react"

interface EditableSectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  editor?: React.ReactNode
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
  defaultEditing?: boolean
}

export function EditableSection({
  title,
  icon,
  children,
  editor,
  onEdit,
  onSave,
  onCancel,
  defaultEditing = false,
}: EditableSectionProps) {
  const [editing, setEditing] = useState(defaultEditing)

  return (
    <div className={`rounded-xl border bg-card transition-all ${
      editing
        ? "border-primary/40 shadow-card-editing"
        : "border-border/50 shadow-card hover:shadow-card-hover hover:border-border/70"
    }`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/25">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary/75">
              {icon}
            </span>
          )}
          <h3 className="text-base font-heading font-semibold tracking-tight text-foreground/85">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!editing ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => { setEditing(true); onEdit?.() }}
              className="text-muted-foreground/50 hover:text-foreground gap-1.5 text-xs h-7 px-2.5"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => { setEditing(false); onSave?.() }}
                className="text-secondary hover:text-secondary/80 hover:bg-secondary/10 gap-1.5 text-xs h-7 px-2.5"
              >
                <Check className="size-3.5" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => { setEditing(false); onCancel?.() }}
                className="text-muted-foreground/50 hover:text-muted-foreground gap-1 text-xs h-7"
              >
                <X className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="px-5 py-4">
        {editing && editor ? editor : children}
      </div>
    </div>
  )
}
