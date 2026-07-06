"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ReactFlow, Background, Controls, MiniMap,
  type Node, type Edge, type NodeProps,
  Handle, Position, useNodesState, useEdgesState,
  MarkerType, BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { EditableSection } from "./editable-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Database, Plus, Trash2, GitBranch, Table } from "lucide-react"
import type { DataEntity, Attribute, Relationship } from "@/lib/types"

function EntityNode({ data, selected }: NodeProps) {
  const entity = data.entity as DataEntity
  return (
    <div className={`rounded-lg border-2 bg-card min-w-[180px] transition-all ${
      selected
        ? "border-primary/50 shadow-node-selected"
        : "border-border/40 shadow-node hover:shadow-node-selected hover:border-primary/30"
    }`}>
      <Handle type="target" position={Position.Top} className="!border-2 !border-border/50 !bg-background !size-3" />
      <div className="border-b border-border/20 bg-gradient-to-r from-primary/8 to-transparent px-4 py-3">
        <p className="text-sm font-medium font-heading text-foreground/85">{entity.name}</p>
        <p className="text-[10px] text-muted-foreground/50 font-mono mt-0.5">{entity.id}</p>
      </div>
      <div className="px-4 py-2.5 space-y-1">
        {entity.attributes.length === 0 && <p className="text-[10px] text-muted-foreground/30 italic">No attributes</p>}
        {entity.attributes.map((attr, i) => (
          <div key={i} className="flex items-center gap-2 py-0.5">
            <span className="text-xs font-medium text-foreground/75">{attr.name}</span>
            <span className="text-[10px] text-muted-foreground/50 font-mono ml-auto bg-muted/40 px-1.5 py-0.5 rounded">{attr.type}</span>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-2 !border-border/50 !bg-background !size-3" />
    </div>
  )
}

const nodeTypes = { entity: EntityNode }

function EntityEditor({ entity, index, onChange, onRemove }: {
  entity: DataEntity; index: number
  onChange: (i: number, e: DataEntity) => void
  onRemove: (i: number) => void
}) {
  return (
    <div className="rounded-lg border border-border/30 bg-card p-3.5 space-y-3 shadow-subtle">
      <div className="flex items-center gap-2.5">
        <Input value={entity.name} onChange={(e) => onChange(index, { ...entity, name: e.target.value })}
          placeholder="Entity name" className="h-8 flex-1 text-sm font-medium bg-background/40 rounded-lg" />
        <code className="text-[10px] text-muted-foreground/50 font-mono bg-muted/30 px-1.5 py-0.5 rounded">{entity.id}</code>
        <Button variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
          <Trash2 className="size-3.5 text-destructive/50" />
        </Button>
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">Attributes</p>
        {entity.attributes.map((attr, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Input value={attr.name} onChange={(e) => {
              const attrs = entity.attributes.map((a, j) => j === i ? { ...a, name: e.target.value } : a)
              onChange(index, { ...entity, attributes: attrs })
            }} placeholder="name" className="h-7 flex-1 text-xs bg-background/40 rounded-lg" />
            <Input value={attr.type} onChange={(e) => {
              const attrs = entity.attributes.map((a, j) => j === i ? { ...a, type: e.target.value } : a)
              onChange(index, { ...entity, attributes: attrs })
            }} placeholder="type" className="h-7 w-24 text-xs font-mono bg-background/40 rounded-lg" />
            <Button variant="ghost" size="icon-xs" onClick={() => {
              const attrs = entity.attributes.filter((_, j) => j !== i)
              onChange(index, { ...entity, attributes: attrs })
            }}>
              <Trash2 className="size-3 text-destructive/40" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="xs" onClick={() => onChange(index, { ...entity, attributes: [...entity.attributes, { name: "", type: "string" }] })}
          className="gap-1 border-border/30 rounded-lg text-[10px] h-6"><Plus className="size-3" /> Attribute</Button>
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">Relationships</p>
        {entity.relationships.map((rel, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Input value={rel.targetId} onChange={(e) => {
              const rels = entity.relationships.map((r, j) => j === i ? { ...r, targetId: e.target.value } : r)
              onChange(index, { ...entity, relationships: rels })
            }} placeholder="target id" className="h-7 w-28 text-xs font-mono bg-background/40 rounded-lg" />
            <Input value={rel.type} onChange={(e) => {
              const rels = entity.relationships.map((r, j) => j === i ? { ...r, type: e.target.value } : r)
              onChange(index, { ...entity, relationships: rels })
            }} placeholder="has many" className="h-7 flex-1 text-xs bg-background/40 rounded-lg" />
            <Button variant="ghost" size="icon-xs" onClick={() => {
              const rels = entity.relationships.filter((_, j) => j !== i)
              onChange(index, { ...entity, relationships: rels })
            }}>
              <Trash2 className="size-3 text-destructive/40" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="xs" onClick={() => onChange(index, { ...entity, relationships: [...entity.relationships, { targetId: "", type: "has many" }] })}
          className="gap-1 border-border/30 rounded-lg text-[10px] h-6"><Plus className="size-3" /> Relationship</Button>
      </div>
    </div>
  )
}

function FlowDiagram({ entities }: { entities: DataEntity[] }) {
  const initialNodes = useMemo(() => entities.map((entity, i) => ({
    id: entity.id, type: "entity" as const,
    position: { x: (i % 3) * 260, y: Math.floor(i / 3) * 200 },
    data: { entity },
  })), [entities])

  const initialEdges = useMemo(() => entities.flatMap((entity) =>
    entity.relationships.map((rel, j) => ({
      id: `${entity.id}-${rel.targetId}-${j}`,
      source: entity.id, target: rel.targetId,
      label: rel.type, type: "smoothstep", animated: true,
      style: { stroke: "oklch(0.5 0.03 50 / 0.35)", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "oklch(0.5 0.03 50 / 0.45)" },
      labelStyle: { fontSize: 9, fontWeight: 600, fill: "oklch(0.4 0.03 50 / 0.65)" },
      labelBgStyle: { fill: "oklch(0.97 0.01 75)", fillOpacity: 0.9 },
      labelBgPadding: [6, 3] as [number, number], labelBgBorderRadius: 4,
    }))
  ), [entities])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => { setNodes(initialNodes); setEdges(initialEdges) }, [initialNodes, initialEdges])

  return (
    <div className="h-[400px] rounded-xl border border-border/30 bg-[#f5f2ed]/60 shadow-sm overflow-hidden">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} fitView minZoom={0.5} maxZoom={2} proOptions={{ hideAttribution: true }}>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="oklch(0.5 0.03 50 / 0.06)" />
        <Controls showInteractive={false} className="!border-border/25 !bg-card/90 !shadow-md !backdrop-blur-sm !rounded-lg" />
        <MiniMap nodeStrokeColor="oklch(0.5 0.03 50 / 0.25)" nodeColor="oklch(0.85 0.01 60)"
          nodeStrokeWidth={3} maskColor="oklch(0 0 0 / 0.08)" zoomable pannable
          style={{ width: 140, height: 100, background: "oklch(0.97 0.01 75 / 0.9)" }}
          className="!border !border-border/20 !rounded-lg !shadow-sm" />
      </ReactFlow>
    </div>
  )
}

interface DataModelSectionProps {
  dataModel: DataEntity[]
  onUpdate: (dataModel: DataEntity[]) => void
}

export function DataModelSection({ dataModel, onUpdate }: DataModelSectionProps) {
  const [editModel, setEditModel] = useState<DataEntity[]>(dataModel)
  const [showFlow, setShowFlow] = useState(true)

  return (
    <EditableSection title="Data Model" icon={<Database className="size-4" />}
      editor={
        <div className="space-y-2.5">
          {editModel.map((e, i) => (
            <EntityEditor key={i} entity={e} index={i}
              onChange={(i, entity) => setEditModel(editModel.map((e, j) => j === i ? entity : e))}
              onRemove={(i) => setEditModel(editModel.filter((_, j) => j !== i))} />
          ))}
          <Button variant="outline" size="xs" onClick={() => setEditModel([...editModel, { id: `entity-${editModel.length + 1}`, name: "", attributes: [], relationships: [] }])}
            className="gap-1.5 border-border/30 rounded-lg text-xs"><Plus className="size-3.5" /> Add Entity</Button>
        </div>
      }
      onSave={() => onUpdate(editModel)}
      onEdit={() => setEditModel(dataModel.map(e => ({ ...e, attributes: [...e.attributes], relationships: [...e.relationships] })))}
      onCancel={() => setEditModel([...dataModel])}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button variant={showFlow ? "default" : "outline"} size="xs" onClick={() => setShowFlow(true)}
            className={`gap-1.5 rounded-lg text-xs shadow-xs ${showFlow ? "shadow-primary/15" : "border-border/30"}`}><GitBranch className="size-3.5" /> Diagram</Button>
          <Button variant={!showFlow ? "default" : "outline"} size="xs" onClick={() => setShowFlow(false)}
            className={`gap-1.5 rounded-lg text-xs shadow-xs ${!showFlow ? "shadow-secondary/10" : "border-border/30"}`}><Table className="size-3.5" /> List</Button>
        </div>
        {showFlow ? <FlowDiagram entities={dataModel} /> : (
          <div className="grid gap-3 sm:grid-cols-2">
            {dataModel.map((entity) => (
              <div key={entity.id} className="rounded-xl border border-border/30 bg-card p-4 space-y-2 shadow-card hover:shadow-card-hover transition-all">
                <p className="text-sm font-medium font-heading text-foreground/85">{entity.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground/50">{entity.id}</p>
                <div className="space-y-1 pt-1">
                  {entity.attributes.map((attr, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-foreground/65">{attr.name}</span>
                      <span className="text-[10px] text-muted-foreground/50 font-mono bg-muted/40 px-1.5 py-0.5 rounded">{attr.type}</span>
                    </div>
                  ))}
                </div>
                {entity.relationships.length > 0 && (
                  <div className="pt-2 border-t border-border/20 space-y-1">
                    {entity.relationships.map((rel, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground/50">→ <span className="font-mono">{rel.targetId}</span> ({rel.type})</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </EditableSection>
  )
}
