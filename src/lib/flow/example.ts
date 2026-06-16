import type { FlowFile, FlowProject } from "./types";

export const AI_PROMPT = `Você vai me ajudar a criar um fluxograma para ser importado no app Fluxo.

Antes de gerar qualquer JSON, apenas responda: "Entendi. Estou pronto para receber o contexto do fluxo."

Depois disso, aguarde meu próximo comando.

Quando eu enviar o contexto, você deve me ajudar a organizar teoricamente o fluxo, fazer perguntas se necessário e só gerar o JSON quando eu pedir explicitamente.

O JSON final deve representar blocos, formas, setas, rótulos, informações ocultas, posição visual aproximada e conexões entre os elementos.

Não gere o JSON agora.
Apenas confirme que entendeu e aguarde.`;

export const EXAMPLE_FLOW_FILE: FlowFile = {
  app: "Fluxo",
  version: "0.1",
  project: {
    id: "example-flow",
    name: "Exemplo de Fluxo",
    background: "#f8fafc",
    viewport: { x: 0, y: 0, zoom: 1 },
  },
  nodes: [
    {
      id: "node-1",
      type: "block",
      shape: "rounded-rectangle",
      title: "Início",
      summary: "Começo do fluxo",
      hiddenInfo: "Informações internas do bloco inicial.",
      position: { x: 100, y: 100 },
      size: { width: 180, height: 80 },
      style: { backgroundColor: "#ffffff", borderColor: "#d1d5db", textColor: "#111827" },
      icon: { type: "default", name: "play" },
      semantic: {
        objective: "Representar o início do processo",
        inputs: [],
        outputs: ["próxima etapa"],
        rules: [],
        notes: "Esse campo deve ser útil para uma IA entender o fluxo.",
      },
    },
    {
      id: "node-2",
      type: "block",
      shape: "rounded-rectangle",
      title: "Próxima etapa",
      summary: "Etapa seguinte",
      hiddenInfo: "",
      position: { x: 380, y: 100 },
      size: { width: 180, height: 80 },
      style: { backgroundColor: "#ffffff", borderColor: "#d1d5db", textColor: "#111827" },
      semantic: { objective: "", inputs: [], outputs: [], rules: [], notes: "" },
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      label: "Continuar",
      hiddenInfo: "Essa seta representa a passagem para a próxima etapa.",
      type: "orthogonal",
      stroke: "solid",
      hasArrow: true,
      semantic: {
        condition: "Após iniciar",
        priority: "normal",
        rules: [],
        notes: "Informações semânticas da conexão.",
      },
    },
  ],
};

export const DEMO_PROJECT: FlowProject = {
  id: "demo",
  name: "Fluxo de demonstração",
  background: "#fafafa",
  updatedAt: new Date().toISOString(),
  nodes: [
    mkNode("n1", "Início", 80, 80, "rounded-rectangle"),
    mkNode("n2", "Definir objetivo", 320, 80, "rectangle"),
    mkNode("n3", "Escolher caminho", 320, 220, "diamond", 200, 100),
    mkNode("n4", "Executar etapa", 600, 160, "rectangle"),
    mkNode("n5", "Revisar", 600, 320, "rectangle"),
    mkNode("n6", "Fim", 860, 240, "rounded-rectangle"),
  ],
  edges: [
    mkEdge("e1", "n1", "n2"),
    mkEdge("e2", "n2", "n3"),
    mkEdge("e3", "n3", "n4", "Sim"),
    mkEdge("e4", "n3", "n5", "Não"),
    mkEdge("e5", "n4", "n6"),
    mkEdge("e6", "n5", "n6"),
  ],
};

export const MOCK_LIBRARY: FlowProject[] = [
  DEMO_PROJECT,
  {
    id: "onboarding",
    name: "Onboarding de usuário",
    background: "#ffffff",
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    nodes: [
      mkNode("a", "Bem-vindo", 80, 80, "rounded-rectangle"),
      mkNode("b", "Cadastro", 320, 80, "rectangle"),
      mkNode("c", "Confirmação", 560, 80, "rounded-rectangle"),
    ],
    edges: [mkEdge("e1", "a", "b"), mkEdge("e2", "b", "c")],
  },
  {
    id: "support",
    name: "Atendimento ao cliente",
    background: "#f8fafc",
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    nodes: [
      mkNode("s1", "Contato", 80, 80, "rectangle"),
      mkNode("s2", "Triagem", 320, 80, "diamond", 180, 100),
      mkNode("s3", "Resolução", 560, 80, "rectangle"),
    ],
    edges: [mkEdge("e1", "s1", "s2"), mkEdge("e2", "s2", "s3")],
  },
];

function mkNode(
  id: string,
  title: string,
  x: number,
  y: number,
  shape: import("./types").ShapeType = "rounded-rectangle",
  width = 180,
  height = 80,
): import("./types").FluxoNodeSerialized {
  return {
    id,
    type: "block",
    shape,
    title,
    summary: "",
    hiddenInfo: "",
    position: { x, y },
    size: { width, height },
    style: { backgroundColor: "#ffffff", borderColor: "#d1d5db", textColor: "#111827" },
    semantic: { objective: "", inputs: [], outputs: [], rules: [], notes: "" },
  };
}

function mkEdge(
  id: string,
  source: string,
  target: string,
  label?: string,
): import("./types").FluxoEdgeSerialized {
  return {
    id,
    source,
    target,
    label,
    hiddenInfo: "",
    type: "orthogonal",
    stroke: "solid",
    hasArrow: true,
    semantic: { condition: "", priority: "normal", rules: [], notes: "" },
  };
}

export function projectToFlowFile(p: FlowProject): FlowFile {
  return {
    app: "Fluxo",
    version: "0.1",
    project: {
      id: p.id,
      name: p.name,
      background: p.background,
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    nodes: p.nodes,
    edges: p.edges,
  };
}

export function flowFileToProject(f: FlowFile): FlowProject {
  return {
    id: f.project.id,
    name: f.project.name,
    background: f.project.background,
    updatedAt: new Date().toISOString(),
    nodes: f.nodes,
    edges: f.edges,
  };
}

export function validateFlowFile(input: unknown): { ok: boolean; error?: string; file?: FlowFile } {
  try {
    if (!input || typeof input !== "object") return { ok: false, error: "JSON inválido." };
    const f = input as FlowFile;
    if (f.app !== "Fluxo") return { ok: false, error: "Campo 'app' deve ser 'Fluxo'." };
    if (!f.project?.id || !f.project?.name)
      return { ok: false, error: "Projeto inválido (id/name)." };
    if (!Array.isArray(f.nodes)) return { ok: false, error: "Campo 'nodes' deve ser uma lista." };
    if (!Array.isArray(f.edges)) return { ok: false, error: "Campo 'edges' deve ser uma lista." };
    return { ok: true, file: f };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
