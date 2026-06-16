import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { FluxoEdgeData, EdgeLineType, EdgeStrokeType } from "@/lib/flow/types";

export function EdgePropertiesModal({
  open,
  data,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean;
  data: FluxoEdgeData | null;
  onOpenChange: (o: boolean) => void;
  onSave: (d: FluxoEdgeData) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<FluxoEdgeData | null>(data);
  useEffect(() => setDraft(data), [data]);
  if (!draft) return null;

  const update = (patch: Partial<FluxoEdgeData>) => setDraft({ ...draft, ...patch });
  const sem = (patch: Partial<FluxoEdgeData["semantic"]>) =>
    setDraft({ ...draft, semantic: { ...draft.semantic, ...patch } });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar seta</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Row label="Rótulo">
            <Input
              value={draft.label ?? ""}
              onChange={(e) => update({ label: e.target.value })}
              placeholder="Texto opcional sobre a seta"
            />
          </Row>
          <Row label="Informação oculta">
            <Textarea
              rows={2}
              value={draft.hiddenInfo}
              onChange={(e) => update({ hiddenInfo: e.target.value })}
            />
          </Row>
          <div className="grid grid-cols-2 gap-3">
            <Row label="Tipo">
              <select
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                value={draft.lineType}
                onChange={(e) => update({ lineType: e.target.value as EdgeLineType })}
              >
                <option value="orthogonal">Ortogonal</option>
                <option value="bezier">Curva</option>
                <option value="straight">Reta</option>
              </select>
            </Row>
            <Row label="Traço">
              <select
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
                value={draft.stroke}
                onChange={(e) => update({ stroke: e.target.value as EdgeStrokeType })}
              >
                <option value="solid">Contínua</option>
                <option value="dashed">Pontilhada</option>
              </select>
            </Row>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <div className="text-sm font-medium">Mostrar seta</div>
              <div className="text-xs text-muted-foreground">Conexão com ou sem ponta</div>
            </div>
            <Switch
              checked={draft.hasArrow}
              onCheckedChange={(v) => update({ hasArrow: v })}
            />
          </div>
          <Row label="Condição">
            <Input
              value={draft.semantic.condition}
              onChange={(e) => sem({ condition: e.target.value })}
            />
          </Row>
          <Row label="Prioridade">
            <select
              className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
              value={draft.semantic.priority}
              onChange={(e) =>
                sem({ priority: e.target.value as FluxoEdgeData["semantic"]["priority"] })
              }
            >
              <option value="low">Baixa</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
            </select>
          </Row>
          <Row label="Observações">
            <Textarea
              rows={2}
              value={draft.semantic.notes}
              onChange={(e) => sem({ notes: e.target.value })}
            />
          </Row>
        </div>
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
