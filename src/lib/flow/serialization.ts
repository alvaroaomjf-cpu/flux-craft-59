import type { FlowFile, FlowProject } from "./types";
import { CURRENT_SCHEMA_VERSION } from "./types";
import { DEFAULT_PROJECT_SETTINGS, DEFAULT_VIEWPORT, nowIso } from "./defaults";
import { normalizeFlowFile } from "./normalization";

export function projectToFlowFile(project: FlowProject): FlowFile {
  const createdAt = project.createdAt ?? project.updatedAt ?? nowIso();
  const updatedAt = nowIso();

  const candidate: FlowFile = {
    app: "Fluxo",
    schemaVersion: CURRENT_SCHEMA_VERSION,
    project: {
      id: project.id,
      name: project.name,
      description: project.description ?? "",
      createdAt,
      updatedAt,
      background: project.background,
      viewport: project.viewport ?? { ...DEFAULT_VIEWPORT },
      settings: project.settings ?? { ...DEFAULT_PROJECT_SETTINGS },
      metadata: project.metadata ?? { source: "manual", tags: [] },
    },
    nodes: project.nodes,
    edges: project.edges,
  };

  const normalized = normalizeFlowFile(candidate);
  if (!normalized.ok || !normalized.file) {
    throw new Error(normalized.error ?? "Não foi possível serializar o fluxo.");
  }
  return normalized.file;
}

export function flowFileToProject(file: FlowFile): FlowProject {
  const normalized = normalizeFlowFile(file);
  if (!normalized.ok || !normalized.file) {
    throw new Error(normalized.error ?? "Arquivo .flow.json inválido.");
  }

  const f = normalized.file;
  return {
    id: f.project.id,
    name: f.project.name,
    description: f.project.description,
    background: f.project.background,
    createdAt: f.project.createdAt,
    updatedAt: f.project.updatedAt ?? nowIso(),
    viewport: f.project.viewport,
    settings: f.project.settings,
    metadata: f.project.metadata,
    nodes: f.nodes,
    edges: f.edges,
  };
}

export function parseFlowFileJson(jsonText: string) {
  try {
    const parsed = JSON.parse(jsonText);
    return normalizeFlowFile(parsed);
  } catch (error) {
    return {
      ok: false,
      error: `JSON inválido: ${(error as Error).message}`,
    };
  }
}

export function stringifyFlowFile(file: FlowFile) {
  const normalized = normalizeFlowFile(file);
  if (!normalized.ok || !normalized.file) {
    throw new Error(normalized.error ?? "Arquivo .flow.json inválido.");
  }
  return JSON.stringify(normalized.file, null, 2);
}

export function slugifyFlowName(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "fluxo-sem-titulo";
}

export function getFlowFileName(name: string) {
  return `${slugifyFlowName(name)}.flow.json`;
}
