import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { FluxoNodeData, ShapeType } from "@/lib/flow/types";

const SHAPES: { id: ShapeType; label: string }[] = [
  { id: "rectangle", label: "Retângulo" },
  { id: "rounded-rectangle", label: "Arredondado" },
  { id: "circle", label: "Círculo" },
  { id: "diamond", label: "Losango" },
  { id: "cylinder", label: "Cilindro" },
  { id: "hexagon", label: "Hexágono" },
];

export function NodePropertiesModal({
  open,
  data,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  data: FluxoNodeData | null;
  onOpenChange: (o: boolean) => void;
  onSave: (d: FluxoNodeData) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<FluxoNodeData | null>(data);
  useEffect(() => setDraft(data), [data]);
  if (!draft) return null;

  const update = (patch: Partial<FluxoNodeData>) => setDraft({ ...draft, ...patch });
  const updateStyle = (k: keyof FluxoNodeData["style"], v: string) =>
    setDraft({ ...draft, style: { ...draft.style, [k]: v } });
  const updateSemantic = (k: keyof FluxoNodeData["semantic"], v: unknown) =>
    setDraft({ ...draft, semantic: { ...draft.semantic, [k]: v } });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar bloco</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
            <TabsTrigger value="semantic">Semântica</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-3 pt-3">
            <Field label="Título">
              <Input value={draft.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Descrição curta">
              <Input value={draft.summary} onChange={(e) => update({ summary: e.target.value })} />
            </Field>
            <Field label="Informação oculta">
              <Textarea
                rows={3}
                value={draft.hiddenInfo}
                onChange={(e) => update({ hiddenInfo: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Largura">
                <Input
                  type="number"
                  value={draft.width}
                  onChange={(e) => update({ width: Math.max(60, Number(e.target.value) || 0) })}
                />
              </Field>
              <Field label="Altura">
                <Input
                  type="number"
                  value={draft.height}
                  onChange={(e) => update({ height: Math.max(40, Number(e.target.value) || 0) })}
                />
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-3 pt-3">
            <Field label="Formato">
              <div className="grid grid-cols-3 gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update({ shape: s.id })}
                    className={`rounded-md border px-2 py-2 text-xs transition ${
                      draft.shape === s.id
                        ? "border-foreground bg-accent"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <ColorField
                label="Fundo"
                value={draft.style.backgroundColor}
                onChange={(v) => updateStyle("backgroundColor", v)}
              />
              <ColorField
                label="Borda"
                value={draft.style.borderColor}
                onChange={(v) => updateStyle("borderColor", v)}
              />
              <ColorField
                label="Texto"
                value={draft.style.textColor}
                onChange={(v) => updateStyle("textColor", v)}
              />
            </div>
            <Field label="Ícone (nome)">
              <Input
                placeholder="ex: play, check, user"
                value={draft.icon?.name ?? ""}
                onChange={(e) =>
                  update({
                    icon: e.target.value
                      ? { type: "default", name: e.target.value }
                      : undefined,
                  })
                }
              />
            </Field>
          </TabsContent>

          <TabsContent value="semantic" className="space-y-3 pt-3">
            <Field label="Objetivo">
              <Input
                value={draft.semantic.objective}
                onChange={(e) => updateSemantic("objective", e.target.value)}
              />
            </Field>
            <Field label="Entradas (separadas por vírgula)">
              <Input
                value={draft.semantic.inputs.join(", ")}
                onChange={(e) =>
                  updateSemantic(
                    "inputs",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Field>
            <Field label="Saídas (separadas por vírgula)">
              <Input
                value={draft.semantic.outputs.join(", ")}
                onChange={(e) =>
                  updateSemantic(
                    "outputs",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Field>
            <Field label="Regras (separadas por vírgula)">
              <Input
                value={draft.semantic.rules.join(", ")}
                onChange={(e) =>
                  updateSemantic(
                    "rules",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Field>
            <Field label="Observações">
              <Textarea
                rows={3}
                value={draft.semantic.notes}
                onChange={(e) => updateSemantic("notes", e.target.value)}
              />
            </Field>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          {onDelete ? (
            <Button variant="destructive" onClick={onDelete} className="mr-auto">
              Excluir
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onSave(draft);
              onOpenChange(false);
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs" />
      </div>
    </Field>
  );
}
