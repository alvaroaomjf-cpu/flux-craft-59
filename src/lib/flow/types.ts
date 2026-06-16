// Domain types for Fluxo. Kept frontend-only; persistence/logic to be added later.

export type ShapeType =
  | "rectangle"
  | "rounded-rectangle"
  | "circle"
  | "diamond"
  | "cylinder"
  | "hexagon";

export type EdgeLineType = "orthogonal" | "straight" | "bezier";
export type EdgeStrokeType = "solid" | "dashed";

export interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export interface NodeIcon {
  type: "default" | "custom";
  name: string;
}

export interface NodeSemantic {
  objective: string;
  inputs: string[];
  outputs: string[];
  rules: string[];
  notes: string;
}

export interface FluxoNodeData {
  shape: ShapeType;
  title: string;
  summary: string;
  hiddenInfo: string;
  style: NodeStyle;
  icon?: NodeIcon;
  semantic: NodeSemantic;
  width: number;
  height: number;
  [key: string]: unknown;
}

export interface EdgeSemantic {
  condition: string;
  priority: "low" | "normal" | "high";
  rules: string[];
  notes: string;
}

export interface FluxoEdgeData {
  label?: string;
  hiddenInfo: string;
  lineType: EdgeLineType;
  stroke: EdgeStrokeType;
  hasArrow: boolean;
  semantic: EdgeSemantic;
  [key: string]: unknown;
}

export interface FlowProject {
  id: string;
  name: string;
  background: string;
  updatedAt: string;
  nodes: FluxoNodeSerialized[];
  edges: FluxoEdgeSerialized[];
}

export interface FluxoNodeSerialized {
  id: string;
  type: "block";
  shape: ShapeType;
  title: string;
  summary: string;
  hiddenInfo: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: NodeStyle;
  icon?: NodeIcon;
  semantic: NodeSemantic;
}

export interface FluxoEdgeSerialized {
  id: string;
  source: string;
  target: string;
  label?: string;
  hiddenInfo: string;
  type: EdgeLineType;
  stroke?: EdgeStrokeType;
  hasArrow?: boolean;
  semantic: EdgeSemantic;
}

export interface FlowFile {
  app: "Fluxo";
  version: string;
  project: {
    id: string;
    name: string;
    background: string;
    viewport: { x: number; y: number; zoom: number };
  };
  nodes: FluxoNodeSerialized[];
  edges: FluxoEdgeSerialized[];
}

export const DEFAULT_NODE_STYLE: NodeStyle = {
  backgroundColor: "#ffffff",
  borderColor: "#d1d5db",
  textColor: "#111827",
};

export const DEFAULT_SEMANTIC: NodeSemantic = {
  objective: "",
  inputs: [],
  outputs: [],
  rules: [],
  notes: "",
};

export const DEFAULT_EDGE_SEMANTIC: EdgeSemantic = {
  condition: "",
  priority: "normal",
  rules: [],
  notes: "",
};
