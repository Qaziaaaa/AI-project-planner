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
          className="min-h-[200px] text-xs font-mono bg-background/40 rounded-lg leading-relaxed" />
      }
      onSave={() => onUpdate(editPrompt)}
      onEdit={() => setEditPrompt(prompt)}
      onCancel={() => setEditPrompt(prompt)}
    >
      <div className="relative group/code">
        <div className="max-h-[260px] overflow-y-auto rounded-lg border border-border/25 bg-[#1c1917] p-4">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-stone-300 font-mono">
            {prompt}
          </pre>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <Button variant="outline" size="xs" className="gap-1.5 border-stone-600/40 bg-stone-800/70 text-stone-300 hover:text-stone-100 hover:bg-stone-700/80 hover:border-stone-500/50 backdrop-blur-sm rounded-lg h-7 shadow-sm" onClick={handleCopy}>
            {copied ? <><Check className="size-3 text-secondary" /><span className="text-[10px]">Copied</span></>
              : <><Copy className="size-3" /><span className="text-[10px]">Copy</span></>}
          </Button>
        </div>
      </div>
    </EditableSection>
  )
}
