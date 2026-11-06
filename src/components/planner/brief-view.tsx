"use client"

import { useState } from "react"
import type { ProjectBrief, DataEntity } from "@/lib/types"
import { SummarySection } from "./summary-section"
import { FeaturesSection } from "./features-section"
import { TechStackSection } from "./tech-stack-section"
import { RoutesSection } from "./routes-section"
import { DataModelSection } from "./data-model-section"
import { PhasesSection } from "./phases-section"
import { RisksSection } from "./risks-section"
import { PromptSection } from "./prompt-section"
import { CostSection } from "./cost-section"
import { SecuritySection } from "./security-section"
import { ScaffoldingSection } from "./scaffolding-section"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Database, ListChecks, ShieldAlert, FileCode } from "lucide-react"

interface BriefViewProps {
  brief: ProjectBrief
  onUpdate: (brief: ProjectBrief) => void
}

type TabType = "overview" | "architecture" | "kanban" | "security-costs" | "code-prompt"

export function BriefView({ brief, onUpdate }: BriefViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")

  return (
    <div className="flex flex-col gap-6">
      {/* Command Center Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/55 bg-card p-1.5 shadow-card scrollbar-none">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("overview")}
          className="gap-2 text-xs font-medium rounded-lg h-9 px-3.5"
        >
          <LayoutDashboard className="size-4" /> Overview
        </Button>
        <Button
          variant={activeTab === "architecture" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("architecture")}
          className="gap-2 text-xs font-medium rounded-lg h-9 px-3.5"
        >
          <Database className="size-4" /> Architecture & Data
        </Button>
        <Button
          variant={activeTab === "kanban" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("kanban")}
          className="gap-2 text-xs font-medium rounded-lg h-9 px-3.5"
        >
          <ListChecks className="size-4" /> Features & Phases
        </Button>
        <Button
          variant={activeTab === "security-costs" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("security-costs")}
          className="gap-2 text-xs font-medium rounded-lg h-9 px-3.5"
        >
          <ShieldAlert className="size-4" /> Costs & Security
        </Button>
        <Button
          variant={activeTab === "code-prompt" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("code-prompt")}
          className="gap-2 text-xs font-medium rounded-lg h-9 px-3.5"
        >
          <FileCode className="size-4" /> Scaffolding & Prompt
        </Button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4 animate-fade-in-up">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <SummarySection
              summary={brief.summary}
              targetUsers={brief.targetUsers}
              onUpdate={(summary, targetUsers) =>
                onUpdate({ ...brief, summary, targetUsers })
              }
            />
            <TechStackSection
              techStack={brief.techStack}
              onUpdate={(techStack) => onUpdate({ ...brief, techStack })}
            />
            <RoutesSection
              pages={brief.pages}
              onUpdate={(pages) => onUpdate({ ...brief, pages })}
            />
            <RisksSection
              risks={brief.risks}
              onUpdate={(risks) => onUpdate({ ...brief, risks })}
            />
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="space-y-4">
            <DataModelSection
              dataModel={brief.dataModel}
              onUpdate={(dataModel: DataEntity[]) => onUpdate({ ...brief, dataModel })}
            />
            <TechStackSection
              techStack={brief.techStack}
              onUpdate={(techStack) => onUpdate({ ...brief, techStack })}
            />
          </div>
        )}

        {activeTab === "kanban" && (
          <div className="space-y-4">
            <FeaturesSection
              features={brief.coreFeatures}
              onUpdate={(coreFeatures) => onUpdate({ ...brief, coreFeatures })}
            />
            <PhasesSection
              phases={brief.buildPhases}
              onUpdate={(buildPhases) => onUpdate({ ...brief, buildPhases })}
            />
          </div>
        )}

        {activeTab === "security-costs" && (
          <div className="space-y-4">
            <CostSection costEstimate={brief.costEstimate} />
            <SecuritySection securityChecklist={brief.securityChecklist} />
          </div>
        )}

        {activeTab === "code-prompt" && (
          <div className="space-y-4">
            <ScaffoldingSection scaffolding={brief.codeScaffolding} />
            <PromptSection
              prompt={brief.starterPrompt}
              onUpdate={(starterPrompt) => onUpdate({ ...brief, starterPrompt })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
