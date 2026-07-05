"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"

interface IdeaInputProps {
  onGenerate: (idea: string) => Promise<void>
  loading: boolean
}

export function IdeaInput({ onGenerate, loading }: IdeaInputProps) {
  const [idea, setIdea] = useState("")
  const [focused, setFocused] = useState(false)

  const handleSubmit = () => {
    if (!idea.trim() || loading) return
    onGenerate(idea.trim())
  }

  return (
    <div className="relative">
      <div className={`rounded-xl border bg-card transition-all ${
        focused
          ? "border-primary/50 shadow-card-editing ring-1 ring-primary/15"
          : "border-border/50 shadow-card hover:shadow-card-hover hover:border-border/70"
      }`}>
        <Textarea
          placeholder="Describe your app idea in a few sentences..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="min-h-[130px] resize-none text-base leading-relaxed bg-transparent border-0 shadow-none rounded-xl px-5 pt-4 pb-3 focus-visible:ring-0 placeholder:text-muted-foreground/35"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit()
            }
          }}
        />
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="text-xs text-muted-foreground/40 font-mono">
            ⌘↵ to generate
          </span>
          <Button
            onClick={handleSubmit}
            disabled={!idea.trim() || loading}
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-sm h-9 px-5 rounded-lg transition-all active:scale-[0.97]"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  )
}
