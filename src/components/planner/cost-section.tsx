"use client"

import { DollarSign, Server, Database, Cloud } from "lucide-react"
import type { CostEstimate } from "@/lib/types"

interface CostSectionProps {
  costEstimate?: CostEstimate
}

export function CostSection({ costEstimate }: CostSectionProps) {
  if (!costEstimate) return null

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
            <DollarSign className="size-4" />
          </div>
          <h2 className="text-sm font-heading font-semibold text-foreground">Infrastructure & Cost Estimator</h2>
        </div>
        <div className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
          Est. {costEstimate.totalEstimatedMonthly}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/30 bg-background/40 p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Server className="size-3.5 text-primary" />
            <span>Hosting & Compute</span>
          </div>
          <div className="text-sm font-medium text-foreground">{costEstimate.hosting.service}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{costEstimate.hosting.tier}</span>
            <span className="font-semibold text-foreground">{costEstimate.hosting.estimatedCost}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border/30 bg-background/40 p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Database className="size-3.5 text-primary" />
            <span>Database & Storage</span>
          </div>
          <div className="text-sm font-medium text-foreground">{costEstimate.database.service}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{costEstimate.database.tier}</span>
            <span className="font-semibold text-foreground">{costEstimate.database.estimatedCost}</span>
          </div>
        </div>
      </div>

      {costEstimate.thirdPartyServices && costEstimate.thirdPartyServices.length > 0 && (
        <div className="rounded-lg border border-border/30 bg-background/40 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Cloud className="size-3.5 text-primary" />
            <span>APIs & Third-Party Services</span>
          </div>
          <div className="space-y-1.5">
            {costEstimate.thirdPartyServices.map((svc, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-foreground/80">{svc.service} ({svc.tier})</span>
                <span className="font-medium text-foreground">{svc.estimatedCost}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
