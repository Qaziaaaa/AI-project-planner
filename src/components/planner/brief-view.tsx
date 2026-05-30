"use client"

import type { ProjectBrief, DataEntity } from "@/lib/types"
import { SummarySection } from "./summary-section"
import { FeaturesSection } from "./features-section"
import { TechStackSection } from "./tech-stack-section"
import { RoutesSection } from "./routes-section"
import { DataModelSection } from "./data-model-section"
import { PhasesSection } from "./phases-section"
import { RisksSection } from "./risks-section"
import { PromptSection } from "./prompt-section"

interface BriefViewProps {
  brief: ProjectBrief
  onUpdate: (brief: ProjectBrief) => void
}

export function BriefView({ brief, onUpdate }: BriefViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <SummarySection
        summary={brief.summary}
        targetUsers={brief.targetUsers}
        onUpdate={(summary, targetUsers) =>
          onUpdate({ ...brief, summary, targetUsers })
        }
      />

      <FeaturesSection
        features={brief.coreFeatures}
        onUpdate={(coreFeatures) => onUpdate({ ...brief, coreFeatures })}
      />

      <TechStackSection
        techStack={brief.techStack}
        onUpdate={(techStack) => onUpdate({ ...brief, techStack })}
      />

      <RoutesSection
        pages={brief.pages}
        onUpdate={(pages) => onUpdate({ ...brief, pages })}
      />

      <DataModelSection
        dataModel={brief.dataModel}
        onUpdate={(dataModel: DataEntity[]) => onUpdate({ ...brief, dataModel })}
      />

      <PhasesSection
        phases={brief.buildPhases}
        onUpdate={(buildPhases) => onUpdate({ ...brief, buildPhases })}
      />

      <RisksSection
        risks={brief.risks}
        onUpdate={(risks) => onUpdate({ ...brief, risks })}
      />

      <PromptSection
        prompt={brief.starterPrompt}
        onUpdate={(starterPrompt) => onUpdate({ ...brief, starterPrompt })}
      />
    </div>
  )
}
