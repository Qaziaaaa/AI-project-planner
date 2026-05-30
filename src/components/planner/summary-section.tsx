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
      title="App Summary"
      icon={<FileText className="size-4" />}
      editor={
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider font-mono">Summary</label>
            <Textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)}
              className="min-h-[100px] text-base bg-background/40 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider font-mono">Target Users</label>
            <Textarea value={editTargetUsers} onChange={(e) => setEditTargetUsers(e.target.value)}
              className="min-h-[80px] text-base bg-background/40 rounded-xl" />
          </div>
        </div>
      }
      onSave={() => onUpdate(editSummary, editTargetUsers)}
      onEdit={() => { setEditSummary(summary); setEditTargetUsers(targetUsers) }}
      onCancel={() => { setEditSummary(summary); setEditTargetUsers(targetUsers) }}
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-xl bg-muted/20 border border-border/15 px-5 py-4">
          <p className="text-base leading-relaxed text-foreground/75">{summary}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider font-mono mb-2.5">Target Users</h4>
          <p className="text-base leading-relaxed text-foreground/75">{targetUsers}</p>
        </div>
      </div>
    </EditableSection>
  )
}
