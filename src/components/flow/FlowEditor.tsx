import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FluxoNode } from "./FluxoNode";
import { Toolbar, type Tool } from "./Toolbar";
import { NodePropertiesModal } from "./NodePropertiesModal";
import { EdgePropertiesModal } from "./EdgePropertiesModal";
import { ShortcutHelpModal } from "./ShortcutHelpModal";
import {
  DEFAULT_NODE_STYLE,
  DEFAULT_SEMANTIC,
  DEFAULT_EDGE_SEMANTIC,
  type FluxoEdgeData,
  type FluxoNodeData,
  type FluxoNodeSerialized,
  type FluxoEdgeSerialized,
  type FlowProject,
} from "@/lib/flow/types";
import { projectToFlowFile, validateFlowFile, flowFileToProject } from "@/lib/flow/example";
import { setCurrentProject, upsertProject } from "@/lib/flow/store";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  HelpCircle,
  Palette,
  Presentation,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const nodeTypes = { fluxo: FluxoNode };

function projectToRF(p: FlowProject): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = p.nodes.map((n) => ({
    id: n.id,
    type: "fluxo",
    position: n.position,
    data: {
      shape: n.shape,
      title: n.title,
      summary: n.summary,
      hiddenInfo: n.hiddenInfo,
      style: n.style,
      icon: n.icon,
      semantic: n.semantic,
      width: n.size.width,
      height: n.size.height,
    } satisfies FluxoNodeData,
  }));
  const edges: Edge[] = p.edges.map((e) => rfEdge(e));
  return { nodes, edges };
}

function rfEdge(e: FluxoEdgeSerialized): Edge {
  const data: FluxoEdgeData = {
    label: e.label,
    hiddenInfo: e.hiddenInfo,
    lineType: e.type,
    stroke: e.stroke ?? "solid",
    hasArrow: e.hasArrow ?? true,
    semantic: e.semantic,
  };
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type:
      e.type === "orthogonal"
        ? "smoothstep"
        : e.type === "bezier"
          ? "default"
          : "straight",
    markerEnd:
      e.hasArrow ?? true
        ? { type: MarkerType.ArrowClosed, color: "#64748b", width: 18, height: 18 }
        : undefined,
    style: { strokeDasharray: (e.stroke ?? "solid") === "dashed" ? "5 4" : undefined },
    data,
  };
}

function rfToProject(
  base: FlowProject,
  nodes: Node[],
  edges: Edge[],
): FlowProject {
  const nNodes: FluxoNodeSerialized[] = nodes.map((n) => {
    const d = n.data as FluxoNodeData;
    return {
      id: n.id,
      type: "block",
      shape: d.shape,
      title: d.title,
      summary: d.summary,
      hiddenInfo: d.hiddenInfo,
      position: n.position,
      size: { width: d.width, height: d.height },
      style: d.style,
      icon: d.icon,
      semantic: d.semantic,
    };
  });
  const nEdges: FluxoEdgeSerialized[] = edges.map((e) => {
    const d = (e.data as FluxoEdgeData | undefined) ?? {
      hiddenInfo: "",
      lineType: "orthogonal",
      stroke: "solid",
      hasArrow: true,
      semantic: DEFAULT_EDGE_SEMANTIC,
    };
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: d.label ?? (typeof e.label === "string" ? e.label : undefined),
      hiddenInfo: d.hiddenInfo,
      type: d.lineType,
      stroke: d.stroke,
      hasArrow: d.hasArrow,
      semantic: d.semantic,
    };
  });
  return { ...base, nodes: nNodes, edges: nEdges, updatedAt: new Date().toISOString() };
}

interface FlowEditorProps {
  project: FlowProject;
}

export function FlowEditor(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditorInner {...props} />
    </ReactFlowProvider>
  );
}

function FlowEditorInner({ project: initialProject }: FlowEditorProps) {
  const [project, setProject] = useState<FlowProject>(initialProject);
  const initial = useMemo(() => projectToRF(initialProject), [initialProject]);
  const [nodes, setNodes] = useState<Node[]>(initial.nodes);
  const [edges, setEdges] = useState<Edge[]>(initial.edges);

  const [tool, setTool] = useState<Tool>("select");
  const [toolbarMode, setToolbarMode] = useState<"side" | "floating">("side");
  const [gridOn, setGridOn] = useState(true);
  const [snapOn, setSnapOn] = useState(true);
  const [presentation, setPresentation] = useState(false);
  const [background, setBackground] = useState(initialProject.background);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { fitView, screenToFlowPosition } = useReactFlow();

  // Undo/redo stacks — minimal implementation.
  const historyRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const futureRef = useRef<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const snapshot = useCallback(() => {
    historyRef.current.push({ nodes, edges });
    if (historyRef.current.length > 50) historyRef.current.shift();
    futureRef.current = [];
  }, [nodes, edges]);

  // Persist
  useEffect(() => {
    const updated = rfToProject({ ...project, background }, nodes, edges);
    setProject(updated);
    setCurrentProject(updated);
    upsertProject(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, background]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (conn: Connection) => {
      snapshot();
      const id = `edge-${Date.now()}`;
      const serialized: FluxoEdgeSerialized = {
        id,
        source: conn.source!,
        target: conn.target!,
        label: undefined,
        hiddenInfo: "",
        type: "orthogonal",
        stroke: "solid",
        hasArrow: true,
        semantic: { ...DEFAULT_EDGE_SEMANTIC },
      };
      setEdges((eds) => addEdge(rfEdge(serialized), eds));
    },
    [snapshot],
  );

  const addBlock = useCallback(
    (atFlow?: { x: number; y: number }) => {
      snapshot();
      const id = `node-${Date.now()}`;
      const pos = atFlow ?? { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 };
      const data: FluxoNodeData = {
        shape: "rounded-rectangle",
        title: "Novo bloco",
        summary: "",
        hiddenInfo: "",
        style: { ...DEFAULT_NODE_STYLE },
        semantic: { ...DEFAULT_SEMANTIC },
        width: 180,
        height: 80,
      };
      setNodes((nds) => [...nds, { id, type: "fluxo", position: pos, data }]);
    },
    [snapshot],
  );

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    futureRef.current.push({ nodes, edges });
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [nodes, edges]);
  const redo = useCallback(() => {
    const nxt = futureRef.current.pop();
    if (!nxt) return;
    historyRef.current.push({ nodes, edges });
    setNodes(nxt.nodes);
    setEdges(nxt.edges);
  }, [nodes, edges]);

  // Organize (simple layered fallback)
  const organize = useCallback(
    (dir: "vertical" | "horizontal" | "radial" | "compact" = "horizontal") => {
      snapshot();
      // Simple BFS layering from "roots" (no incoming edges).
      const incoming = new Map<string, number>();
      nodes.forEach((n) => incoming.set(n.id, 0));
      edges.forEach((e) => incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1));
      const layers: string[][] = [];
      const visited = new Set<string>();
      let current = nodes.filter((n) => (incoming.get(n.id) ?? 0) === 0).map((n) => n.id);
      if (current.length === 0 && nodes.length) current = [nodes[0]!.id];
      while (current.length) {
        layers.push(current);
        current.forEach((id) => visited.add(id));
        const next = new Set<string>();
        edges.forEach((e) => {
          if (current.includes(e.source) && !visited.has(e.target)) next.add(e.target);
        });
        current = Array.from(next);
      }
      // Append any orphans
      nodes.forEach((n) => {
        if (!visited.has(n.id)) layers.push([n.id]);
      });

      const gapX = dir === "compact" ? 200 : 260;
      const gapY = dir === "compact" ? 120 : 160;
      setNodes((nds) =>
        nds.map((n) => {
          const layer = layers.findIndex((l) => l.includes(n.id));
          const indexIn = layers[layer]?.indexOf(n.id) ?? 0;
          let x = 80,
            y = 80;
          if (dir === "vertical") {
            x = 80 + indexIn * gapX;
            y = 80 + layer * gapY;
          } else if (dir === "radial") {
            const angle = (indexIn / Math.max(layers[layer]?.length ?? 1, 1)) * Math.PI * 2;
            const r = 120 + layer * 160;
            x = 500 + Math.cos(angle) * r;
            y = 320 + Math.sin(angle) * r;
          } else {
            x = 80 + layer * gapX;
            y = 80 + indexIn * gapY;
          }
          return { ...n, position: { x, y } };
        }),
      );
      setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
    },
    [edges, nodes, fitView, snapshot],
  );

  const exportJson = useCallback(() => {
    const file = projectToFlowFile(rfToProject({ ...project, background }, nodes, edges));
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.flow.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Fluxo exportado.");
  }, [nodes, edges, project, background]);

  const exportPng = useCallback(() => {
    // TODO(real-export): integrate html-to-image to actually rasterize. For now, simulate.
    toast.info("Exportação PNG: simulada nesta versão visual.");
  }, []);

  const triggerImport = useCallback(() => fileInputRef.current?.click(), []);
  const onImportFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          const res = validateFlowFile(parsed);
          if (!res.ok || !res.file) {
            toast.error(res.error ?? "Arquivo inválido.");
            return;
          }
          const proj = flowFileToProject(res.file);
          const rf = projectToRF(proj);
          setProject(proj);
          setBackground(proj.background);
          setNodes(rf.nodes);
          setEdges(rf.edges);
          toast.success("Fluxo importado.");
        } catch (err) {
          toast.error("JSON inválido: " + (err as Error).message);
        }
      };
      reader.readAsText(f);
      e.target.value = "";
    },
    [],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        exportJson();
        return;
      }
      if (ctrl && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportJson();
        return;
      }
      if (ctrl && e.key.toLowerCase() === "o") {
        e.preventDefault();
        triggerImport();
        return;
      }
      if (ctrl && e.key.toLowerCase() === "p") {
        e.preventDefault();
        exportPng();
        return;
      }
      if (ctrl && e.key.toLowerCase() === "l") {
        e.preventDefault();
        organize("horizontal");
        return;
      }
      if (ctrl && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (ctrl && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (ctrl && e.key === "0") {
        e.preventDefault();
        fitView({ padding: 0.2 });
        return;
      }
      if (e.key === "F11") {
        e.preventDefault();
        setPresentation((v) => !v);
        return;
      }
      const k = e.key.toLowerCase();
      if (k === "v") setTool("select");
      else if (k === "b") addBlock();
      else if (k === "f") setTool("shape");
      else if (k === "l") setTool("line");
      else if (k === "a") setTool("arrow");
      else if (k === "c") setTool("connect");
      else if (k === "t") setTool("text");
      else if (k === "g") setGridOn((v) => !v);
      else if (k === "s") setSnapOn((v) => !v);
      else if (k === "?") setHelpOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addBlock, exportJson, exportPng, fitView, organize, redo, triggerImport, undo]);

  const onPaneClick = useCallback(
    (e: React.MouseEvent) => {
      if (tool === "block") {
        const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        addBlock(pos);
        setTool("select");
      }
      setSelectedNode(null);
      setSelectedEdge(null);
    },
    [tool, addBlock, screenToFlowPosition],
  );

  const onNodeClick = useCallback((_: unknown, n: Node) => {
    setSelectedNode(n);
    setSelectedEdge(null);
  }, []);
  const onEdgeClick = useCallback((_: unknown, ed: Edge) => {
    setSelectedEdge(ed);
    setSelectedNode(null);
  }, []);
  const onNodeDoubleClick = useCallback((_: unknown, n: Node) => {
    setSelectedNode(n);
    setNodeModalOpen(true);
  }, []);
  const onEdgeDoubleClick = useCallback((_: unknown, ed: Edge) => {
    setSelectedEdge(ed);
    setEdgeModalOpen(true);
  }, []);

  const onSaveNode = (d: FluxoNodeData) => {
    if (!selectedNode) return;
    snapshot();
    setNodes((nds) => nds.map((n) => (n.id === selectedNode.id ? { ...n, data: d } : n)));
  };
  const onDeleteNode = () => {
    if (!selectedNode) return;
    snapshot();
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setNodeModalOpen(false);
    setSelectedNode(null);
  };
  const onSaveEdge = (d: FluxoEdgeData) => {
    if (!selectedEdge) return;
    snapshot();
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedEdge.id
          ? {
              ...e,
              data: d,
              label: d.label,
              type: d.lineType === "orthogonal" ? "smoothstep" : d.lineType === "bezier" ? "default" : "straight",
              markerEnd: d.hasArrow
                ? { type: MarkerType.ArrowClosed, color: "#64748b", width: 18, height: 18 }
                : undefined,
              style: { strokeDasharray: d.stroke === "dashed" ? "5 4" : undefined },
            }
          : e,
      ),
    );
  };
  const onDeleteEdge = () => {
    if (!selectedEdge) return;
    snapshot();
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
    setEdgeModalOpen(false);
    setSelectedEdge(null);
  };

  return (
    <div ref={wrapperRef} className="relative h-screen w-screen overflow-hidden bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.flow,.flow.json,application/json"
        className="hidden"
        onChange={onImportFile}
      />

      {/* Top bar */}
      {!presentation && (
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-border bg-card/85 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Fluxo
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <input
                value={project.name}
                onChange={(e) => setProject({ ...project, name: e.target.value })}
                className="bg-transparent font-display text-base italic tracking-tight outline-none focus:underline"
                style={{ width: `${Math.max(project.name.length, 8)}ch` }}
              />
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
              · {nodes.length} blocos · {edges.length} setas
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                  <Palette className="h-4 w-4" />
                  Aparência
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 space-y-3">
                <div>
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Cor do canvas
                  </Label>
                  <div className="mt-2 flex items-center overflow-hidden rounded-md border border-border bg-background">
                    <label className="relative h-9 w-10 cursor-pointer border-r border-border">
                      <span className="absolute inset-1 rounded" style={{ background: background }} />
                      <input
                        type="color"
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                    <Input
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="h-9 border-0 font-mono text-xs focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Predefinidos
                  </Label>
                  <div className="mt-2 grid grid-cols-6 gap-1.5">
                    {["#ffffff", "#fafaf7", "#f7f1e6", "#e0eefb", "#ece6f5", "#0f172a"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setBackground(c)}
                        className={`h-8 rounded-md border transition ${
                          background === c ? "border-foreground ring-2 ring-foreground/20" : "border-border hover:border-foreground/40"
                        }`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  Organizar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem onClick={() => organize("horizontal")}>Horizontal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => organize("vertical")}>Vertical</DropdownMenuItem>
                <DropdownMenuItem onClick={() => organize("radial")}>Radial</DropdownMenuItem>
                <DropdownMenuItem onClick={() => organize("compact")}>Compacto</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHelpOpen(true)}
              className="rounded-full"
              title="Atalhos"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => setPresentation(true)}
              className="rounded-full gap-1.5 bg-foreground text-background hover:bg-foreground/90"
            >
              <Presentation className="h-3.5 w-3.5" />
              Apresentar
            </Button>
          </div>
        </div>
      )}

      {/* Presentation exit */}
      {presentation && (
        <button
          onClick={() => setPresentation(false)}
          className="absolute right-4 top-4 z-40 flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Sair do modo apresentação
        </button>
      )}

      {/* Canvas */}
      <div
        className="absolute inset-0"
        style={{
          paddingTop: presentation ? 0 : 48,
          paddingLeft: !presentation && toolbarMode === "side" ? 220 : 0,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          nodeTypes={nodeTypes}
          snapToGrid={snapOn}
          snapGrid={[16, 16]}
          fitView
          style={{ backgroundColor: background }}
          proOptions={{ hideAttribution: true }}
        >
          {gridOn ? (
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          ) : null}
          <Controls
            position="bottom-right"
            showInteractive={false}
            className="!shadow-sm"
          />
          <MiniMap
            position="bottom-left"
            pannable
            zoomable
            maskColor="rgba(15,23,42,0.04)"
            nodeColor={(n) => {
              const d = n.data as FluxoNodeData;
              return d?.style?.backgroundColor ?? "#ffffff";
            }}
            nodeStrokeColor={(n) => (n.data as FluxoNodeData)?.style?.borderColor ?? "#d1d5db"}
            style={{ width: 160, height: 110 }}
          />
        </ReactFlow>
      </div>

      {/* Toolbar */}
      <Toolbar
        mode={toolbarMode}
        onModeChange={setToolbarMode}
        tool={tool}
        onToolChange={setTool}
        gridOn={gridOn}
        snapOn={snapOn}
        onToggleGrid={() => setGridOn((v) => !v)}
        onToggleSnap={() => setSnapOn((v) => !v)}
        onUndo={undo}
        onRedo={redo}
        onOrganize={() => organize("horizontal")}
        onExportJson={exportJson}
        onExportPng={exportPng}
        onImportJson={triggerImport}
        onFitView={() => fitView({ padding: 0.2 })}
        onPresentation={() => setPresentation(true)}
        onAddBlock={() => addBlock()}
      />

      <NodePropertiesModal
        open={nodeModalOpen}
        data={(selectedNode?.data as FluxoNodeData) ?? null}
        onOpenChange={setNodeModalOpen}
        onSave={onSaveNode}
        onDelete={onDeleteNode}
      />
      <EdgePropertiesModal
        open={edgeModalOpen}
        data={(selectedEdge?.data as FluxoEdgeData) ?? null}
        onOpenChange={setEdgeModalOpen}
        onSave={onSaveEdge}
        onDelete={onDeleteEdge}
      />
      <ShortcutHelpModal open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
