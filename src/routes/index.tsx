import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Upload,
  Sparkles,
  Search,
  Copy,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  deleteProject,
  duplicateProject,
  loadLibrary,
  newEmptyProject,
  setCurrentProject,
  upsertProject,
} from "@/lib/flow/store";
import { flowFileToProject, validateFlowFile } from "@/lib/flow/example";
import { ExternalAiFlowModal } from "@/components/flow/ExternalAiFlowModal";
import type { FlowProject } from "@/lib/flow/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fluxo — desenhe fluxogramas com clareza" },
      {
        name: "description",
        content:
          "Fluxo é uma ferramenta minimalista para desenhar fluxogramas, com canvas infinito, blocos personalizáveis e exportação em .flow.json.",
      },
      { property: "og:title", content: "Fluxo — desenhe fluxogramas com clareza" },
      {
        property: "og:description",
        content: "Ferramenta minimalista para desenhar fluxogramas manualmente.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState<FlowProject[]>([]);
  const [query, setQuery] = useState("");
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => setLibrary(loadLibrary()), []);

  const filtered = useMemo(
    () =>
      library.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [library, query],
  );

  const openProject = (p: FlowProject) => {
    setCurrentProject(p);
    navigate({ to: "/editor/$id", params: { id: p.id } });
  };

  const createNew = () => {
    const p = newEmptyProject();
    upsertProject(p);
    openProject(p);
  };

  const duplicate = (p: FlowProject) => {
    const copy = duplicateProject(p);
    upsertProject(copy);
    setLibrary(loadLibrary());
    toast.success("Fluxo duplicado.");
  };

  const remove = (id: string) => {
    deleteProject(id);
    setLibrary(loadLibrary());
  };

  const importFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.flow,.flow.json,application/json";
    input.onchange = () => {
      const f = input.files?.[0];
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
          upsertProject(proj);
          openProject(proj);
        } catch (e) {
          toast.error("JSON inválido: " + (e as Error).message);
        }
      };
      reader.readAsText(f);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors closeButton />

      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card">
              <span className="text-[13px] font-semibold tracking-tight">F</span>
            </div>
            <span className="text-[15px] font-medium tracking-tight">Fluxo</span>
          </div>
          <a
            className="text-xs text-muted-foreground"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            v0.1 · pré-visualização
          </a>
        </div>
      </header>

      {/* Hero / actions */}
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-[34px] font-medium leading-tight tracking-tight text-foreground">
          Desenhe fluxogramas
          <br />
          <span className="text-muted-foreground">com clareza, no seu ritmo.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Uma tela infinita, blocos simples e o necessário para pensar visualmente.
          Exporte como <code className="rounded bg-muted px-1 py-0.5 text-xs">.flow.json</code> ou continue
          conversando com IAs externas.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          <Button onClick={createNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar novo fluxo
          </Button>
          <Button variant="outline" onClick={importFile} className="gap-2">
            <Upload className="h-4 w-4" />
            Importar .flow.json
          </Button>
          <Button variant="outline" onClick={() => setAiOpen(true)} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Criar fluxo com IA externa
          </Button>
        </div>
      </section>

      {/* Library */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-base font-medium tracking-tight">Seus fluxos</h2>
            <p className="text-xs text-muted-foreground">
              {library.length} {library.length === 1 ? "fluxo salvo" : "fluxos salvos"}
            </p>
          </div>
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar fluxo…"
              className="h-9 pl-8 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <FlowCard
              key={p.id}
              project={p}
              onOpen={() => openProject(p)}
              onDuplicate={() => duplicate(p)}
              onDelete={() => remove(p.id)}
            />
          ))}
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Nenhum fluxo encontrado.
            </div>
          ) : null}
        </div>
      </section>

      <ExternalAiFlowModal
        open={aiOpen}
        onOpenChange={setAiOpen}
        onImport={(proj) => {
          upsertProject(proj);
          openProject(proj);
        }}
      />
    </div>
  );
}

function FlowCard({
  project,
  onOpen,
  onDuplicate,
  onDelete,
}: {
  project: FlowProject;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const date = new Date(project.updatedAt);
  const formatted = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <button
        onClick={onOpen}
        className="relative h-32 w-full overflow-hidden border-b border-border"
        style={{ background: project.background }}
        aria-label={`Abrir ${project.name}`}
      >
        <Thumbnail project={project} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">{project.name}</h3>
            <p className="text-xs text-muted-foreground">
              {project.nodes.length} blocos · atualizado {formatted}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Button size="sm" variant="default" onClick={onOpen} className="gap-1">
            Abrir
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={onDuplicate} title="Duplicar">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              title="Excluir"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Thumbnail({ project }: { project: FlowProject }) {
  if (project.nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Fluxo vazio
      </div>
    );
  }
  // Compute bounds and normalize
  const xs = project.nodes.map((n) => n.position.x);
  const ys = project.nodes.map((n) => n.position.y);
  const ws = project.nodes.map((n) => n.position.x + n.size.width);
  const hs = project.nodes.map((n) => n.position.y + n.size.height);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...ws);
  const maxY = Math.max(...hs);
  const w = Math.max(maxX - minX, 1);
  const h = Math.max(maxY - minY, 1);
  return (
    <svg viewBox={`${minX} ${minY} ${w} ${h}`} className="h-full w-full p-3" preserveAspectRatio="xMidYMid meet">
      {project.edges.map((e) => {
        const a = project.nodes.find((n) => n.id === e.source);
        const b = project.nodes.find((n) => n.id === e.target);
        if (!a || !b) return null;
        const ax = a.position.x + a.size.width / 2;
        const ay = a.position.y + a.size.height / 2;
        const bx = b.position.x + b.size.width / 2;
        const by = b.position.y + b.size.height / 2;
        return <line key={e.id} x1={ax} y1={ay} x2={bx} y2={by} stroke="#94a3b8" strokeWidth={2} />;
      })}
      {project.nodes.map((n) => (
        <rect
          key={n.id}
          x={n.position.x}
          y={n.position.y}
          width={n.size.width}
          height={n.size.height}
          rx={n.shape === "rounded-rectangle" ? 16 : 4}
          fill={n.style.backgroundColor}
          stroke={n.style.borderColor}
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}
