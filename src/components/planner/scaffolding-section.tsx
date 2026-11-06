"use client"

import { useState } from "react"
import { FolderTree, Copy, Check, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { CodeScaffolding } from "@/lib/types"

interface ScaffoldingSectionProps {
  scaffolding?: CodeScaffolding
}

export function ScaffoldingSection({ scaffolding }: ScaffoldingSectionProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [copiedTree, setCopiedTree] = useState(false)

  if (!scaffolding) return null

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Copied ${label}`)
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-500">
            <FolderTree className="size-4" />
          </div>
          <h2 className="text-sm font-heading font-semibold text-foreground">Code Scaffolding & Initial Configs</h2>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-border/30 bg-background/50 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Directory Tree</span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                handleCopy(scaffolding.fileTree, "directory tree")
                setCopiedTree(true)
                setTimeout(() => setCopiedTree(false), 2000)
              }}
              className="h-7 text-[11px] gap-1.5"
            >
              {copiedTree ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              {copiedTree ? "Copied" : "Copy Tree"}
            </Button>
          </div>
          <pre className="text-xs font-mono text-foreground/80 overflow-x-auto p-2.5 rounded-md bg-muted/40 border border-border/20">
            {scaffolding.fileTree}
          </pre>
        </div>

        {scaffolding.initialConfigs && scaffolding.initialConfigs.length > 0 && (
          <div className="space-y-3">
            {scaffolding.initialConfigs.map((config, i) => (
              <div key={i} className="rounded-lg border border-border/30 bg-background/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="size-3.5 text-primary" />
                    <span className="text-xs font-mono font-medium text-foreground">{config.filename}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      handleCopy(config.content, config.filename)
                      setCopiedFile(config.filename)
                      setTimeout(() => setCopiedFile(null), 2000)
                    }}
                    className="h-7 text-[11px] gap-1.5"
                  >
                    {copiedFile === config.filename ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    {copiedFile === config.filename ? "Copied" : "Copy Content"}
                  </Button>
                </div>
                <pre className="text-xs font-mono text-foreground/80 overflow-x-auto p-2.5 rounded-md bg-muted/40 border border-border/20 max-h-48">
                  {config.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
