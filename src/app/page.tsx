"use client"

import { useState } from "react"
import { IdeaInput } from "@/components/planner/idea-input"
import { BriefView } from "@/components/planner/brief-view"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { FileDown, RotateCcw, Plus, ClipboardList, Lightbulb, Info } from "lucide-react"
import { downloadMarkdown } from "@/lib/export"
import type { ProjectBrief } from "@/lib/types"

function SkeletonLine({ className = "h-4", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div className={`rounded-lg ${className}`}
      style={{ animationDelay: `${delay}ms`, animationDuration: "1.5s" }}>
      <div className="h-full w-full rounded-lg animate-shimmer" />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border/50 bg-card p-5 space-y-3 shadow-card"
          style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-lg animate-shimmer" />
            <SkeletonLine className="h-5 w-36" />
          </div>
          <div className="space-y-3">
            <SkeletonLine />
            <SkeletonLine className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in-up">
      <div className="relative mb-10">
        <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-elevated shadow-primary/20">
          <ClipboardList className="size-11 text-white" />
        </div>
      </div>
      <h2 className="text-4xl font-heading font-semibold tracking-tight text-foreground/90 mb-3">
        Ready to plan your project?
      </h2>
      <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
        Describe your app idea above and we'll generate a structured brief with features, tech stack, data model, and more.
      </p>
      <div className="mt-12 flex items-center gap-2 text-xs text-muted-foreground/40 font-mono uppercase tracking-wider">
        <span className="size-1.5 rounded-full bg-primary/40" />
        Powered by AI
      </div>
    </div>
  )
}

export default function Home() {
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastIdea, setLastIdea] = useState("")
  const [hint, setHint] = useState<string | null>(null)

  const handleGenerate = async (idea: string) => {
    setLoading(true)
    setHint(null)
    setLastIdea(idea)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      })
      const data = await res.json()
      if (data.error === "short-input" || data.error === "invalid-idea") {
        setHint(data.message)
        return
      }
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate brief")
      }
      setBrief(data as ProjectBrief)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: "oklch(0.17 0.02 50)", border: "1px solid oklch(0.28 0.03 50)", color: "oklch(0.95 0.01 75)" },
      }} />
      <div className="flex flex-col min-h-dvh">
        <header className="sticky top-0 z-10 border-b border-border/40 bg-background/85 shadow-sm backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
              <ClipboardList className="size-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-heading font-semibold tracking-tight text-foreground/90">AI Project Planner</h1>
            </div>
            {brief && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="sm" onClick={() => { downloadMarkdown(brief); toast.success("Exported") }}
                  className="gap-1.5 border-border/40 text-xs shadow-xs">
                  <FileDown className="size-3.5" /> Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => lastIdea && handleGenerate(lastIdea)} disabled={loading}
                  className="gap-1.5 border-border/40 text-xs shadow-xs">
                  <RotateCcw className="size-3.5" /> Regenerate
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setBrief(null); setLastIdea(""); setHint(null) }}
                  className="gap-1.5 border-border/40 text-xs shadow-xs">
                  <Plus className="size-3.5" /> New
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-3xl px-5 py-12">
          <div className="mb-10">
            <IdeaInput onGenerate={handleGenerate} loading={loading} />
            {hint && (
              <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground/80">
                <Info className="size-4 mt-0.5 shrink-0 text-primary" />
                <span>{hint}</span>
              </div>
            )}
          </div>
          {loading ? <LoadingSkeleton /> : brief ? (
            <div className="space-y-4 animate-fade-in-up">
              {brief.feedback && (
                <div className="flex items-start gap-2.5 rounded-lg border border-amber-200/30 bg-amber-50/5 px-4 py-3 text-sm text-foreground/70">
                  <Lightbulb className="size-4 mt-0.5 shrink-0 text-amber-400" />
                  <span>{brief.feedback}</span>
                </div>
              )}
              <BriefView brief={brief} onUpdate={setBrief} />
            </div>
          ) : <EmptyState />}
        </main>
      </div>
    </>
  )
}