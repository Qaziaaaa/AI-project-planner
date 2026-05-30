export interface Feature {
  name: string
  description: string
  priority: "high" | "medium" | "low"
}

export interface TechItem {
  category: string
  items: string[]
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

export interface ProjectBrief {
  summary: string
  targetUsers: string
  coreFeatures: Feature[]
  techStack: TechItem[]
  pages: Route[]
  dataModel: DataEntity[]
  buildPhases: BuildPhase[]
  risks: Risk[]
  starterPrompt: string
}
