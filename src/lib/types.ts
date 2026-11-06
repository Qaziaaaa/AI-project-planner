export interface Feature {
  name: string
  description: string
  priority: "high" | "medium" | "low"
  acceptanceCriteria?: string[]
}

export interface TechItem {
  category: string
  items: string[]
  rationale?: string
}

export interface Route {
  path: string
  name: string
  description: string
}

export interface Attribute {
  name: string
  type: string
}

export interface Relationship {
  targetId: string
  type: string
}

export interface DataEntity {
  id: string
  name: string
  attributes: Attribute[]
  relationships: Relationship[]
}

export interface BuildPhase {
  phase: string
  tasks: string[]
  duration: string
}

export interface Risk {
  risk: string
  mitigation: string
  severity: "high" | "medium" | "low"
}

export interface CostItem {
  service: string
  tier: string
  estimatedCost: string
}

export interface CostEstimate {
  hosting: CostItem
  database: CostItem
  thirdPartyServices: CostItem[]
  totalEstimatedMonthly: string
}

export interface SecurityItem {
  category: "Auth" | "Data" | "Network" | "Compliance"
  requirement: string
  recommendation: string
}

export interface CodeScaffolding {
  fileTree: string
  initialConfigs: { filename: string; content: string }[]
}

export interface ProjectBrief {
  projectType?: string
  summary: string
  targetUsers: string
  coreFeatures: Feature[]
  techStack: TechItem[]
  pages: Route[]
  dataModel: DataEntity[]
  buildPhases: BuildPhase[]
  risks: Risk[]
  starterPrompt: string
  feedback?: string
  costEstimate?: CostEstimate
  securityChecklist?: SecurityItem[]
  codeScaffolding?: CodeScaffolding
}
