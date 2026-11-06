"use client"

import { ShieldCheck, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { SecurityItem } from "@/lib/types"

interface SecuritySectionProps {
  securityChecklist?: SecurityItem[]
}

const categoryColors: Record<string, string> = {
  Auth: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Data: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Network: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Compliance: "bg-amber-500/10 text-amber-500 border-amber-500/20",
}

export function SecuritySection({ securityChecklist }: SecuritySectionProps) {
  if (!securityChecklist || securityChecklist.length === 0) return null

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 shadow-card">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
          <ShieldCheck className="size-4" />
        </div>
        <h2 className="text-sm font-heading font-semibold text-foreground">Security & Compliance Checklist</h2>
      </div>

      <div className="space-y-2.5">
        {securityChecklist.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border/30 bg-background/30 p-3">
            <Lock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{item.requirement}</span>
                <Badge className={`text-[10px] px-1.5 py-0 border ${categoryColors[item.category] || "bg-primary/10 text-primary"}`}>
                  {item.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
