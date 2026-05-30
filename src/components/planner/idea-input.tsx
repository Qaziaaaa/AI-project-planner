"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Zap, Loader2 } from "lucide-react"

interface IdeaInputProps {
  onGenerate: (idea: string) => Promise<void>
  loading: boolean
}

export function IdeaInput({ onGenerate, loading }: IdeaInputProps) {
  const [idea, setIdea] = useState("")

  const handleSubmit = () => {
    if (!idea.trim() || loading) return
    onGenerate(idea.trim())
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Textarea
          placeholder="Describe your app idea in a few sentences..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="min-h-[130px] resize-none text-base leading-relaxed bg-card/60 rounded-2xl border-border/25 px-6 py-5 shadow-sm focus-visible:border-primary/40 placeholder:text-muted-foreground/40"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit()
            }
          }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground/40 font-mono hidden sm:inline">
            ⌘↵
          </span>
          <Button
            onClick={handleSubmit}
            disabled={!idea.trim() || loading}
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-sm h-8 px-4 rounded-xl"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Zap className="size-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  )
}
