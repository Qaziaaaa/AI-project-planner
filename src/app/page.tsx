"use client"

import { useState } from "react"
import { IdeaInput } from "@/components/planner/idea-input"
import { BriefView } from "@/components/planner/brief-view"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"
import { FileDown, RotateCcw, Plus, ClipboardList } from "lucide-react"
import { downloadMarkdown } from "@/lib/export"
import type { ProjectBrief } from "@/lib/types"

function SkeletonBlock({ className = "h-5", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`rounded-lg bg-border/40 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}ms`, animationDuration: "1.5s" }}
    />
  )
}

function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="rounded-2xl border border-border/20 bg-card/40 p-6 space-y-4" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-border/40 animate-pulse" style={{ animationDuration: "1.5s" }} />
        <SkeletonBlock className="h-5 w-40" />
      </div>
      <div className="space-y-2.5">
        <SkeletonBlock />
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="h-5 w-1/2" />
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-fade-in-up">
      <SkeletonCard delay={0} />
      <SkeletonCard delay={60} />
      <SkeletonCard delay={120} />
      <SkeletonCard delay={180} />
      <div className="rounded-2xl border border-border/20 bg-card/40 p-6" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-full bg-border/40 animate-pulse" style={{ animationDuration: "1.5s" }} />
          <SkeletonBlock className="h-5 w-36" />
        </div>
        <div className="h-[300px] rounded-xl bg-border/30 animate-pulse" style={{ animationDuration: "1.5s" }} />
      </div>
      <SkeletonCard delay={300} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
      <div className="relative mb-10">
        <div className="absolute -inset-4 blur-3xl bg-primary/8 rounded-full" />
        <div className="relative flex size-20 items-center justify-center rounded-[2rem] border border-border/20 bg-card/60 shadow-sm">
          <ClipboardList className="size-9 text-primary/70" />
        </div>
      </div>
      <h2 className="text-4xl font-heading font-black tracking-tight text-foreground/90 mb-3">
        Ready to plan your project?
      </h2>
      <p className="text-base text-muted-foreground/70 max-w-md leading-relaxed">
        Describe your app idea above and let AI generate a structured project brief
        with features, tech stack, data model, and more.
      </p>
      <p className="mt-10 text-xs text-muted-foreground/40 font-mono tracking-wider uppercase flex items-center gap-2">
        <span className="inline-block size-1.5 rounded-full bg-primary/40" />
        Powered by OpenRouter + AI SDK
      </p>
    </div>
  )
}

export default function Home() {
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastIdea, setLastIdea] = useState("")

  const handleGenerate = async (idea: string) => {
    setLoading(true)
    setLastIdea(idea)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to generate brief")
      }
      const data: ProjectBrief = await res.json()
      setBrief(data)
      toast.success("Project brief generated!")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: "oklch(0.17 0.015 280)", border: "1px solid oklch(0.25 0.015 280)", color: "oklch(0.92 0.01 80)" },
      }} />
      <div className="flex flex-col min-h-dvh">
        <header className="relative border-b border-border/20 bg-background/70 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
          <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-heading font-extrabold tracking-tight">AI Project Planner</h1>
              <p className="text-xs text-muted-foreground/60 font-mono tracking-wider uppercase">Turn rough ideas into structured briefs</p>
            </div>
            {brief && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => { downloadMarkdown(brief); toast.success("Markdown file downloaded") }}
                  className="gap-2 text-muted-foreground hover:text-foreground text-xs">
                  <FileDown className="size-3.5" /> Export
                </Button>
                <Button variant="ghost" size="sm" onClick={() => lastIdea && handleGenerate(lastIdea)} disabled={loading}
                  className="gap-2 text-muted-foreground hover:text-foreground text-xs">
                  <RotateCcw className="size-3.5" /> Regenerate
                </Button>
                <div className="w-px h-5 bg-border/40 mx-1" />
                <Button variant="outline" size="sm" onClick={() => { setBrief(null); setLastIdea("") }}
                  className="gap-2 border-border/20 text-xs">
                  <Plus className="size-3.5" /> New
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-10">
          <div className="mb-12">
            <IdeaInput onGenerate={handleGenerate} loading={loading} />
          </div>
          {loading ? <LoadingSkeleton /> : brief ? (
            <div className="animate-fade-in-up"><BriefView brief={brief} onUpdate={setBrief} /></div>
          ) : <EmptyState />}
        </main>
      </div>
    </>
  )
}
