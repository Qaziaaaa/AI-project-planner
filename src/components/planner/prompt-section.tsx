"use client"

import { useState } from "react"
import { EditableSection } from "./editable-section"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check, Terminal } from "lucide-react"

interface PromptSectionProps {
  prompt: string
  onUpdate: (prompt: string) => void
}

export function PromptSection({ prompt, onUpdate }: PromptSectionProps) {
  const [editPrompt, setEditPrompt] = useState(prompt)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <EditableSection title="Coding Agent Prompt" icon={<Terminal className="size-4" />}
      editor={
        <Textarea value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)}
          className="min-h-[220px] text-sm font-mono bg-background/40 rounded-xl leading-relaxed" />
      }
      onSave={() => onUpdate(editPrompt)}
      onEdit={() => setEditPrompt(prompt)}
      onCancel={() => setEditPrompt(prompt)}
    >
      <div className="relative group/code">
        <div className="max-h-[280px] overflow-y-auto rounded-xl border border-border/15 bg-[#0a0a0f] p-5">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 font-mono">
            {prompt}
          </pre>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity">
          <Button variant="outline" size="xs" className="gap-1.5 border-border/20 bg-[#0a0a0f]/80 backdrop-blur-sm rounded-xl" onClick={handleCopy}>
            {copied ? <><Check className="size-3.5 text-green-400" /><span className="text-xs">Copied</span></>
              : <><Copy className="size-3.5" /><span className="text-xs">Copy</span></>}
          </Button>
        </div>
      </div>
    </EditableSection>
  )
}
