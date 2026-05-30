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
    <div className={`rounded-2xl border bg-card/60 shadow-sm transition-all ${
      editing ? "border-primary/25 shadow-primary/5" : "border-border/20 hover:border-border/35"
    }`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/10">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary/70">
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
              className="text-muted-foreground/40 hover:text-muted-foreground gap-1.5 text-xs"
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
                className="text-green-600 hover:text-green-500 hover:bg-green-500/8 gap-1.5 text-xs"
              >
                <Check className="size-3.5" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => { setEditing(false); onCancel?.() }}
                className="text-muted-foreground/40 hover:text-muted-foreground gap-1.5 text-xs"
              >
                <X className="size-3.5" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="px-6 py-5">
        {editing && editor ? editor : children}
      </div>
    </div>
  )
}
