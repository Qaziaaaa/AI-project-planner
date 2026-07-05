"use client"

import { useState } from "react"
import { EditableSection } from "./editable-section"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

interface SummarySectionProps {
  summary: string
  targetUsers: string
  onUpdate: (summary: string, targetUsers: string) => void
}

export function SummarySection({ summary, targetUsers, onUpdate }: SummarySectionProps) {
  const [editSummary, setEditSummary] = useState(summary)
  const [editTargetUsers, setEditTargetUsers] = useState(targetUsers)

  return (
    <EditableSection
      title="Summary"
      icon={<FileText className="size-4" />}
      editor={
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Summary</label>
            <Textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)}
              className="min-h-[90px] text-sm bg-background/40 rounded-lg focus-visible:border-primary/30" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Target Users</label>
            <Textarea value={editTargetUsers} onChange={(e) => setEditTargetUsers(e.target.value)}
              className="min-h-[70px] text-sm bg-background/40 rounded-lg focus-visible:border-primary/30" />
          </div>
        </div>
      }
      onSave={() => onUpdate(editSummary, editTargetUsers)}
      onEdit={() => { setEditSummary(summary); setEditTargetUsers(targetUsers) }}
      onCancel={() => { setEditSummary(summary); setEditTargetUsers(targetUsers) }}
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground/75">{summary}</p>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground/50 uppercase tracking-wider mb-1.5">Target Users</h4>
          <p className="text-sm leading-relaxed text-foreground/75">{targetUsers}</p>
        </div>
      </div>
    </EditableSection>
  )
}
