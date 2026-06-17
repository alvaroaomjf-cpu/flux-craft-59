# ANÁLISE DO ESTADO ATUAL — App Fluxo

## 1. Contexto

Este arquivo registra a auditoria inicial do projeto local `fluxo` antes da primeira rodada de desenvolvimento estrutural.

O projeto começou como um front-end visual criado no Lovable. A função desta análise é orientar a evolução incremental do app sem recomeçar do zero e sem quebrar a experiência visual já criada.

Esta análise deve ser lida junto com:

```txt
docs/CONSTITUICAO_DO_APP.md
docs/SCHEMA_FLOW_JSON.md
docs/PROMPT_CODEX.md
docs/ROADMAP.md
```

## 2. Stack atual identificada

O projeto usa uma base moderna de front-end:

- React;
- TypeScript;
- Vite;
- TanStack Router/Start;
- Tailwind;
- Radix UI;
- Lucide React;
- Sonner;
- React Flow via `@xyflow/react`;
- Zod disponível como dependência.

Scripts encontrados no `package.json`:

```txt
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
npm run format
```

## 3. Rotas principais

As rotas principais identificadas são:

```txt
src/routes/index.tsx
src/routes/editor.$id.tsx
```

### 3.1 Home

A home possui:

- tela inicial;
- biblioteca visual/local de fluxos;
- busca;
- criação de novo fluxo;
- duplicação;
- exclusão;
- importação de `.flow.json`;
- modal “Criar fluxo com IA externa”.

### 3.2 Editor

A rota do editor carrega o componente `FlowEditor` e tenta localizar o projeto em armazenamento local. Caso não encontre, cria um fluxo vazio com o id informado pela rota.

## 4. Componentes principais identificados

Componentes centrais:

```txt
src/components/flow/FlowEditor.tsx
src/components/flow/FluxoNode.tsx
src/components/flow/Toolbar.tsx
src/components/flow/NodePropertiesModal.tsx
src/components/flow/EdgePropertiesModal.tsx
src/components/flow/ExternalAiFlowModal.tsx
src/components/flow/ShortcutHelpModal.tsx
```

O componente `FlowEditor.tsx` concentra muita responsabilidade e deve ser refatorado gradualmente.

## 5. Camada de domínio atual

Arquivos principais atuais:

```txt
src/lib/flow/types.ts
src/lib/flow/example.ts
src/lib/flow/store.ts
```

### 5.1 `types.ts`

Contém tipos iniciais para:

- shapes;
- estilos de node;
- ícones;
- semântica de node;
- dados de edge;
- projeto;
- arquivo exportado.

Ponto de atenção: o schema atual ainda usa `version`, enquanto a documentação oficial define `schemaVersion`.

### 5.2 `example.ts`

Atualmente concentra:

- prompt de IA externa;
- exemplo `.flow.json`;
- projeto demo;
- mock de biblioteca;
- funções auxiliares;
- conversão `projectToFlowFile`;
- conversão `flowFileToProject`;
- validação superficial `validateFlowFile`.

Esse arquivo deve ser dividido gradualmente, pois mistura exemplo, domínio, conversão e validação.

### 5.3 `store.ts`

Usa `localStorage` para:

- carregar biblioteca;
- salvar biblioteca;
- criar projeto vazio;
- duplicar projeto;
- guardar projeto atual.

Isso é adequado como fallback web/local inicial, mas deve ser abstraído para futura persistência real em arquivo local.

## 6. Funcionalidades já existentes

O app já possui:

- tela inicial;
- biblioteca local/simulada;
- criação de novo fluxo;
- importação de arquivo JSON;
- exportação de `.flow.json`;
- modal de IA externa;
- editor com React Flow;
- canvas com grid;
- minimap;
- controles de zoom;
- blocos customizados;
- formas básicas;
- handles de conexão;
- toolbar lateral/flutuante;
- edição de node;
- edição de edge;
- informações ocultas;
- modo apresentação;
- undo/redo básico;
- auto-layout simples;
- atalhos parciais.

## 7. Funcionalidades simuladas ou incompletas

As seguintes partes ainda precisam ser implementadas ou fortalecidas:

- exportação PNG real;
- validação robusta de `.flow.json`;
- normalização de arquivos importados;
- schema oficial com `schemaVersion`;
- adapters separados React Flow <-> schema;
- resize visual com alças;
- delete por teclado;
- Ctrl+D para duplicar seleção;
- Ctrl+A para selecionar tudo;
- toolbar flutuante realmente arrastável;
- auto-layout mais organizado;
- roteamento de setas mais inteligente;
- persistência em arquivo local;
- Electron/Tauri;
- janelas separadas;
- múltiplos monitores.

## 8. Riscos atuais

### 8.1 `FlowEditor.tsx` concentrando lógica demais

O editor hoje contém lógica de conversão, exportação, importação, organização, persistência e UI. Isso dificulta evolução.

Mitigação: extrair lógica para `src/lib/flow` e manter o editor focado em interface.

### 8.2 Schema atual diferente do schema documentado

O schema atual funciona para o protótipo, mas ainda não segue completamente `SCHEMA_FLOW_JSON.md`.

Mitigação: criar camada de compatibilidade que importe formato antigo e exporte formato oficial.

### 8.3 Validação superficial

A validação atual verifica apenas campos básicos.

Mitigação: criar validação e normalização centralizadas.

### 8.4 Dependência de `localStorage`

O app ainda não tem persistência local real.

Mitigação: manter `localStorage` como fallback temporário e preparar `desktopBridge` no futuro.

## 9. Ordem segura de implementação

A ordem recomendada é:

```txt
1. Criar/consolidar schema oficial.
2. Criar defaults.
3. Criar validação.
4. Criar normalização.
5. Criar adapters React Flow <-> schema.
6. Refatorar import/export para usar essas funções.
7. Manter compatibilidade com arquivos antigos.
8. Implementar ações básicas pendentes.
9. Implementar resize visual.
10. Implementar PNG real.
11. Melhorar auto-layout.
12. Preparar desktopBridge.
```

## 10. Primeira rodada de desenvolvimento recomendada

Nesta primeira rodada, implementar sem mexer drasticamente na interface:

- `src/lib/flow/schema.ts`;
- `src/lib/flow/defaults.ts`;
- `src/lib/flow/validation.ts`;
- `src/lib/flow/normalization.ts`;
- `src/lib/flow/serialization.ts`;
- `src/lib/flow/adapters.ts`;
- compatibilidade com o schema antigo;
- exportação `.flow.json` no formato oficial;
- importação com validação e normalização;
- manter app visualmente igual.

## 11. O que não alterar agora

Não alterar agora:

- identidade visual geral;
- rotas principais;
- React Flow;
- tela inicial;
- editor visual;
- modais principais;
- modal de IA externa;
- filosofia minimalista;
- ausência de login;
- ausência de IA interna;
- ausência de backend remoto.

## 12. Conclusão

O projeto está em bom estado como protótipo funcional de front-end.

A próxima evolução correta é fortalecer a camada de dados e import/export antes de implementar recursos mais avançados.

A meta imediata é transformar `.flow.json` em uma fonte de verdade confiável, compatível com a documentação e útil tanto para reabrir desenhos quanto para permitir que uma IA externa entenda o fluxo.
