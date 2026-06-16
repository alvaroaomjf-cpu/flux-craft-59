// Lightweight in-memory + localStorage store for the flow library and the currently open project.
// TODO(backend): replace with real persistence when a backend is added.

import { MOCK_LIBRARY } from "./example";
import type { FlowProject } from "./types";

const LIBRARY_KEY = "fluxo.library.v1";
const CURRENT_KEY = "fluxo.current.v1";

export function loadLibrary(): FlowProject[] {
  if (typeof window === "undefined") return MOCK_LIBRARY;
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(MOCK_LIBRARY));
      return MOCK_LIBRARY;
    }
    const parsed = JSON.parse(raw) as FlowProject[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(MOCK_LIBRARY));
      return MOCK_LIBRARY;
    }
    return parsed;
  } catch {
    return MOCK_LIBRARY;
  }
}

export function saveLibrary(lib: FlowProject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
}

export function upsertProject(p: FlowProject) {
  const lib = loadLibrary();
  const idx = lib.findIndex((x) => x.id === p.id);
  const next = { ...p, updatedAt: new Date().toISOString() };
  if (idx >= 0) lib[idx] = next;
  else lib.unshift(next);
  saveLibrary(lib);
}

export function deleteProject(id: string) {
  saveLibrary(loadLibrary().filter((p) => p.id !== id));
}

export function setCurrentProject(p: FlowProject) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_KEY, JSON.stringify(p));
}

export function getCurrentProject(): FlowProject | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as FlowProject) : null;
  } catch {
    return null;
  }
}

export function newEmptyProject(name = "Novo fluxo"): FlowProject {
  return {
    id: `flow-${Date.now()}`,
    name,
    background: "#fafafa",
    updatedAt: new Date().toISOString(),
    nodes: [],
    edges: [],
  };
}

export function duplicateProject(p: FlowProject): FlowProject {
  return {
    ...p,
    id: `flow-${Date.now()}`,
    name: `${p.name} (cópia)`,
    updatedAt: new Date().toISOString(),
  };
}
