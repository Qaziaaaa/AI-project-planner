"""Pydantic schemas mirroring src/lib/types.ts exactly (JSON field names are camelCase)."""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field

Priority = Literal["high", "medium", "low"]
Severity = Literal["high", "medium", "low"]
SecurityCategory = Literal["Auth", "Data", "Network", "Compliance"]


class Feature(BaseModel):
    name: str
    description: str
    priority: Priority
    acceptanceCriteria: Optional[list[str]] = None


class TechItem(BaseModel):
    category: str
    items: list[str]
    rationale: Optional[str] = None


class Page(BaseModel):
    path: str
    name: str
    description: str


class Attribute(BaseModel):
    name: str
    type: str


class Relationship(BaseModel):
    targetId: str
    type: str


class DataEntity(BaseModel):
    id: str
    name: str
    attributes: list[Attribute]
    relationships: list[Relationship]


class BuildPhase(BaseModel):
    phase: str
    tasks: list[str]
    duration: str


class Risk(BaseModel):
    risk: str
    mitigation: str
    severity: Severity


class CostItem(BaseModel):
    service: str
    tier: str
    estimatedCost: str


class CostEstimate(BaseModel):
    hosting: CostItem
    database: CostItem
    thirdPartyServices: list[CostItem]
    totalEstimatedMonthly: str


class SecurityItem(BaseModel):
    category: SecurityCategory
    requirement: str
    recommendation: str


class InitialConfig(BaseModel):
    filename: str
    content: str


class CodeScaffolding(BaseModel):
    fileTree: str
    initialConfigs: list[InitialConfig]


class ProjectBrief(BaseModel):
    projectType: Optional[str] = None
    summary: str
    targetUsers: str
    coreFeatures: list[Feature]
    techStack: list[TechItem]
    pages: list[Page]
    dataModel: list[DataEntity]
    buildPhases: list[BuildPhase]
    risks: list[Risk]
    starterPrompt: str
    feedback: Optional[str] = None
    costEstimate: Optional[CostEstimate] = None
    securityChecklist: Optional[list[SecurityItem]] = None
    codeScaffolding: Optional[CodeScaffolding] = None


# --- Stage-specific intermediate models ---


class IdeaAnalysis(BaseModel):
    isValid: bool = Field(description="False only if the input is gibberish or not a project idea")
    reasoning: str = Field(description="Why the idea is or is not viable as a project brief")
    assumptions: list[str] = Field(description="Assumptions made to fill missing details")
    clarifications: list[str] = Field(description="Ambiguities that were auto-resolved, phrased as decisions")
    refinedIdea: str = Field(description="The idea restated with resolved details, used by downstream stages")


class ScopeSpec(BaseModel):
    summary: str = Field(description="3 sentence executive summary")
    targetUsers: str = Field(description="Detailed user personas and workflows")
    coreFeatures: list[Feature]
    buildPhases: list[BuildPhase]


class ArchitectureSpec(BaseModel):
    projectType: str
    techStack: list[TechItem]
    pages: list[Page]
    dataModel: list[DataEntity]
    codeScaffolding: CodeScaffolding


class ReviewSpec(BaseModel):
    risks: list[Risk]
    costEstimate: CostEstimate
    securityChecklist: list[SecurityItem]
