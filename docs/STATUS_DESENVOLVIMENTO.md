# STATUS_DESENVOLVIMENTO.md

# Status de Desenvolvimento — Fluxo

## Rodada atual

Branch de trabalho:

```txt
dev/estrutura-base-fluxo
```

Esta branch foi criada a partir da `main` para manter o desenvolvimento seguro e separado.

## Objetivo desta rodada

A primeira rodada teve como objetivo organizar a base técnica sem destruir o front-end gerado pelo Lovable.

Foco principal:

```txt
schema .flow.json
validação
normalização
serialização
compatibilidade com o formato antigo
preparação para refatorar o editor
```

## Arquivos adicionados

```txt
docs/ANALISE_ESTADO_ATUAL.md
src/lib/flow/schema.ts
src/lib/flow/defaults.ts
src/lib/flow/normalization.ts
src/lib/flow/validation.ts
src/lib/flow/serialization.ts
src/lib/flow/adapters.ts
```

## Arquivos alterados

```txt
src/lib/flow/types.ts
src/lib/flow/example.ts
src/lib/flow/store.ts
src/components/flow/NodePropertiesModal.tsx
```

## O que foi implementado

### 1. Auditoria documentada

Foi criado `docs/ANALISE_ESTADO_ATUAL.md` com:

- stack identificada;
- rotas principais;
- componentes principais;
- camada de domínio atual;
- funcionalidades já existentes;
- partes simuladas/incompletas;
- riscos;
- ordem segura de implementação.

### 2. Tipos ampliados

`src/lib/flow/types.ts` foi expandido para suportar o schema oficial definido em `docs/SCHEMA_FLOW_JSON.md`.

Foram adicionados/preparados:

- `schemaVersion`;
- `FlowViewport`;
- `FlowProjectSettings`;
- `FlowMetadata`;
- `FlowCustomField`;
- `FlowEdgeStyle`;
- `FlowEdgeRouting`;
- handles de conexão;
- campos opcionais de projeto;
- compatibilidade com `version` antigo;
- prioridades de edge incluindo `critical`;
- tipos futuros de edge.

### 3. Defaults oficiais

Foi criado `src/lib/flow/defaults.ts` com:

- background padrão;
- viewport padrão;
- settings padrão;
- tamanho padrão de node;
- tamanho mínimo de node;
- ícone padrão;
- estilo padrão de edge;
- roteamento padrão;
- criação de ids;
- criação de projeto vazio;
- criação de arquivo vazio;
- lista oficial de shapes.

### 4. Normalização robusta

Foi criado `src/lib/flow/normalization.ts`.

A normalização agora:

- aceita arquivos antigos e novos;
- aplica `schemaVersion: 0.1.0`;
- valida `app: Fluxo`;
- normaliza projeto;
- normaliza viewport;
- normaliza settings;
- normaliza nodes;
- normaliza edges;
- aplica defaults;
- remove edges inválidas;
- deduplica nodes;
- gera warnings;
- preserva informações ocultas e semânticas.

### 5. Validação centralizada

Foi criado `src/lib/flow/validation.ts`.

Funções disponíveis:

```ts
validateFlowFile(input)
assertValidFlowFile(input)
isFlowFile(input)
```

### 6. Serialização oficial

Foi criado `src/lib/flow/serialization.ts`.

Funções disponíveis:

```ts
projectToFlowFile(project)
flowFileToProject(file)
parseFlowFileJson(jsonText)
stringifyFlowFile(file)
slugifyFlowName(name)
getFlowFileName(name)
```

### 7. Ponto central do schema

Foi criado `src/lib/flow/schema.ts` para reexportar tipos, defaults, validação, normalização e serialização.

Objetivo: facilitar imports futuros.

### 8. Adapters React Flow ↔ Fluxo

Foi criado `src/lib/flow/adapters.ts`.

Funções disponíveis:

```ts
fluxoNodeToReactFlowNode(node)
fluxoEdgeToReactFlowEdge(edge)
flowProjectToReactFlow(project)
reactFlowNodeToFluxoNode(node)
reactFlowEdgeToFluxoEdge(edge)
reactFlowToFlowProject(base, nodes, edges)
```

Esses adapters ainda não substituíram completamente a lógica interna do `FlowEditor`, mas já estão prontos para a próxima refatoração.

### 9. Exemplo atualizado

`src/lib/flow/example.ts` foi atualizado para usar o schema oficial com:

```txt
schemaVersion: 0.1.0
createdAt
updatedAt
settings
metadata
style
routing
customFields
```

Também passou a reexportar funções oficiais de validação e serialização.

### 10. Store local alinhado aos defaults

`src/lib/flow/store.ts` agora usa `createEmptyFlowProject`, `createFlowId` e `nowIso`.

A duplicação de projeto também marca `metadata.source = duplicated`.

### 11. Ajuste de tipagem no modal de node

`NodePropertiesModal.tsx` foi ajustado para lidar melhor com o `NodeStyle` expandido, restringindo a edição direta de cores apenas aos campos:

```txt
backgroundColor
borderColor
textColor
```

## O que ainda não foi feito

Ainda falta:

- rodar `npm install` localmente;
- rodar `npm run dev`;
- rodar `npm run build`;
- rodar `npm run lint`;
- validar visualmente a interface;
- refatorar `FlowEditor.tsx` para usar `adapters.ts`;
- implementar delete/duplicar/selecionar tudo por teclado;
- implementar resize visual;
- implementar PNG real;
- melhorar auto-layout;
- preparar desktopBridge;
- adicionar Electron.

## Validação local obrigatória

Como esta rodada foi feita via edição remota de arquivos, a próxima validação deve ser feita localmente:

```bash
npm install
npm run dev
npm run build
npm run lint
```

Se aparecerem erros de TypeScript, eles devem ser corrigidos antes de avançar para resize, PNG e Electron.

## Próxima etapa recomendada

Após validar que o projeto compila, seguir para:

```txt
1. Refatorar FlowEditor.tsx para usar src/lib/flow/adapters.ts.
2. Trocar export/import para usar src/lib/flow/serialization.ts diretamente.
3. Implementar Delete, Ctrl+D e Ctrl+A.
4. Implementar resize visual com NodeResizer.
5. Implementar exportação PNG real.
```

## Observação importante

A `main` não foi alterada nesta rodada.

As alterações estão na branch:

```txt
dev/estrutura-base-fluxo
```
