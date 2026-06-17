# ROADMAP.md

# Roadmap do App Fluxo

## 1. Finalidade deste documento

Este documento define o plano de evolução do app **Fluxo**.

Ele deve ser usado junto com:

```txt
docs/CONSTITUICAO_DO_APP.md
docs/SCHEMA_FLOW_JSON.md
docs/PROMPT_CODEX.md
```

A função deste roadmap é separar o desenvolvimento em fases claras, para evitar que o Codex tente fazer tudo em uma única alteração grande e acabe quebrando o front-end já criado.

O projeto atual começou como uma interface visual feita no Lovable. A próxima etapa é transformar essa base em uma ferramenta local-first, funcional e evolutiva.

---

## 2. Estado atual esperado

O projeto `fluxo` já deve conter uma primeira versão visual com:

- tela inicial;
- biblioteca simulada de fluxos;
- botão para criar novo fluxo;
- botão para importar fluxo;
- botão “Criar fluxo com IA externa”;
- editor visual;
- canvas com React Flow ou equivalente;
- blocos;
- setas;
- toolbar lateral/flutuante;
- modais;
- modo apresentação;
- importação/exportação `.flow.json` parcial ou simulada;
- informações ocultas em blocos/setas;
- schema inicial de fluxo.

Esse estado não é o app final.

Ele é a base visual que deve ser evoluída.

---

## 3. Filosofia do roadmap

O desenvolvimento deve seguir esta lógica:

```txt
Primeiro estabilizar.
Depois estruturar.
Depois implementar funções reais.
Depois melhorar experiência.
Depois transformar em app desktop.
Depois evoluir recursos avançados.
```

Não implementar recursos avançados antes de estabilizar o núcleo.

O núcleo é:

```txt
canvas + blocos + setas + .flow.json + edição + salvar/abrir + PNG.
```

---

## 4. Fase 0 — Preparação local

### Objetivo

Garantir que o projeto local rode corretamente antes de qualquer refatoração.

### Tarefas

- Confirmar que a pasta do projeto se chama `fluxo`.
- Rodar `npm install`.
- Rodar o comando de desenvolvimento existente.
- Verificar se o app abre.
- Verificar se a tela inicial abre.
- Verificar se o editor abre.
- Verificar se não há erros críticos no console.
- Verificar scripts disponíveis no `package.json`.
- Identificar se o projeto usa Vite, TanStack Start, React Router ou outra estrutura.

### Critérios de aceite

- Dependências instaladas.
- Projeto rodando localmente.
- Tela inicial visível.
- Editor visível.
- Nenhum erro fatal impedindo uso básico.

### Não fazer nesta fase

- Não adicionar Electron.
- Não refatorar tudo.
- Não alterar design grande.
- Não trocar biblioteca de canvas.
- Não implementar IA.

---

## 5. Fase 1 — Auditoria técnica

### Objetivo

Entender exatamente o que o Lovable gerou.

### Tarefas

Mapear:

- estrutura de pastas;
- rotas;
- componentes principais;
- estado global/local;
- tipos existentes;
- componentes de canvas;
- componentes de toolbar;
- modais;
- funções de importação;
- funções de exportação;
- modo apresentação;
- atalhos;
- funções simuladas.

### Saída esperada

Criar, se necessário, um arquivo simples:

```txt
docs/ANALISE_INICIAL_CODEX.md
```

Esse arquivo pode conter:

- stack encontrada;
- principais arquivos;
- funções já existentes;
- funções simuladas;
- riscos;
- plano de alteração.

### Critérios de aceite

- Codex sabe onde estão os arquivos principais.
- Codex sabe o que já funciona.
- Codex sabe o que está simulado.
- Codex tem plano antes de mexer.

### Não fazer nesta fase

- Não implementar grandes mudanças antes de mapear.
- Não deletar arquivos sem entender dependências.

---

## 6. Fase 2 — Consolidação do schema `.flow.json`

### Objetivo

Criar uma base confiável para salvar, abrir, importar e exportar fluxos.

### Documentação base

Usar:

```txt
docs/SCHEMA_FLOW_JSON.md
```

### Tarefas

Criar ou consolidar arquivos como:

```txt
src/features/flow/flowTypes.ts
src/features/flow/flowDefaults.ts
src/features/flow/flowValidation.ts
src/features/flow/flowNormalization.ts
src/features/flow/flowSerialization.ts
src/features/flow/flowAdapters.ts
src/features/flow/flowExamples.ts
```

### Implementar

- tipos TypeScript oficiais;
- defaults de projeto;
- defaults de node;
- defaults de edge;
- validação básica;
- normalização;
- exemplo oficial `.flow.json`;
- conversão de schema para React Flow;
- conversão de React Flow para schema.

### Critérios de aceite

- Existe um tipo central para projeto.
- Existe um tipo central para node.
- Existe um tipo central para edge.
- Existe função de normalização.
- Existe função de validação.
- Existe exemplo oficial.
- Exportação e importação usam o mesmo schema.
- `.flow.json` exportado pode ser importado novamente.

### Não fazer nesta fase

- Não criar banco de dados.
- Não criar backend remoto.
- Não implementar múltiplas páginas.
- Não adicionar schema complexo demais.

---

## 7. Fase 3 — Importação e exportação `.flow.json` reais

### Objetivo

Transformar a importação/exportação em recurso confiável.

### Tarefas de exportação

- Converter estado atual para schema oficial.
- Atualizar `updatedAt`.
- Serializar com indentação.
- Baixar arquivo com extensão `.flow.json`.
- Sugerir nome com base no nome do fluxo.
- Preservar informações ocultas.
- Preservar campos semânticos.
- Preservar posições, tamanhos, cores, ícones e conexões.

### Tarefas de importação

- Selecionar arquivo.
- Ler como texto.
- Fazer `JSON.parse`.
- Validar.
- Normalizar.
- Exibir erro amigável se inválido.
- Abrir no editor se válido.
- Preservar tudo que estiver no arquivo.

### Critérios de aceite

- Usuário exporta um fluxo.
- Usuário importa o mesmo arquivo.
- O desenho volta igual.
- As informações ocultas são preservadas.
- As setas são preservadas.
- Campos semânticos são preservados.
- JSON inválido não quebra o app.

### Não fazer nesta fase

- Não implementar exportação PDF.
- Não implementar Mermaid.
- Não implementar Markdown.
- Não implementar banco remoto.

---

## 8. Fase 4 — Editor básico robusto

### Objetivo

Melhorar a experiência central de edição.

### Tarefas

Garantir que o usuário consiga:

- criar bloco;
- escolher forma;
- mover bloco;
- editar bloco;
- excluir bloco;
- duplicar bloco;
- conectar blocos;
- editar conexão;
- excluir conexão;
- adicionar rótulo na conexão;
- adicionar informação oculta no bloco;
- adicionar informação oculta na conexão;
- selecionar elementos;
- alternar ferramentas.

### Blocos

Formas obrigatórias:

```txt
rectangle
rounded-rectangle
circle
diamond
cylinder
hexagon
```

### Conexões

Tipos obrigatórios:

```txt
orthogonal
straight
smooth
dashed
no-arrow
```

### Critérios de aceite

- Editor é utilizável.
- Nenhuma ação básica quebra o app.
- Dados editados aparecem no `.flow.json`.
- Dados importados aparecem no editor.
- Tooltips e modais mostram informações ocultas.

### Não fazer nesta fase

- Não criar IA interna.
- Não criar categorias semânticas fixas.
- Não forçar significado em formas.

---

## 9. Fase 5 — Undo, redo, delete e duplicação

### Objetivo

Tornar a edição segura.

### Tarefas

Implementar ou revisar histórico para:

- criar node;
- mover node;
- redimensionar node;
- editar node;
- apagar node;
- criar edge;
- editar edge;
- apagar edge;
- duplicar seleção;
- organizar fluxo;
- alterar cor;
- alterar ícone.

### Regras

- `Ctrl+Z`: desfazer.
- `Ctrl+Y`: refazer.
- `Delete`: excluir seleção.
- `Ctrl+D`: duplicar seleção.
- `Ctrl+A`: selecionar tudo.

### Cuidado

Não registrar histórico a cada pixel de movimento.

Registrar ações ao final de drag, resize ou edição.

### Critérios de aceite

- Usuário consegue desfazer e refazer ações comuns.
- Delete funciona.
- Duplicar funciona.
- Histórico não fica instável.
- Undo não corrompe conexões.

---

## 10. Fase 6 — Redimensionamento visual dos blocos

### Objetivo

Permitir que o usuário altere tamanho dos blocos no próprio canvas.

### Tarefas

- Adicionar alças de resize.
- Permitir largura e altura independentes.
- Respeitar tamanho mínimo.
- Atualizar estado.
- Atualizar `.flow.json`.
- Registrar no undo/redo.
- Manter conexões ligadas após resize.

### Requisitos

O usuário deve conseguir:

- alongar;
- achatar;
- aumentar largura;
- diminuir largura;
- aumentar altura;
- diminuir altura.

### Critérios de aceite

- Resize visual funciona.
- Tamanho é preservado ao salvar.
- Tamanho é restaurado ao abrir.
- Setas continuam conectadas.

---

## 11. Fase 7 — Setas ortogonais e roteamento melhorado

### Objetivo

Melhorar a clareza das conexões.

### Tarefas

- Padronizar setas ortogonais como estilo principal.
- Melhorar conexão entre handles.
- Exibir pontos de conexão discretos.
- Permitir handles em top/right/bottom/left.
- Recalcular visualmente conexões ao mover blocos.
- Tentar escolher melhor lado quando `sourceHandle` ou `targetHandle` for `auto`.
- Preparar estrutura para pontos intermediários.

### Critérios de aceite

- Setas não ficam visualmente confusas em fluxos simples.
- Ao mover bloco, seta acompanha.
- Handles são preservados no `.flow.json`.
- Rótulo da seta continua legível.
- Informação oculta continua acessível.

### Observação

Não é necessário garantir zero cruzamentos nesta fase.

O objetivo é melhorar o básico e preparar para roteamento avançado.

---

## 12. Fase 8 — Auto-layout por botão

### Objetivo

Implementar organização automática quando o usuário pedir.

### Botão

```txt
Organizar fluxo
```

### Opções

- Vertical;
- Horizontal;
- Radial;
- Compacto.

### MVP obrigatório

- Vertical;
- Horizontal.

### Tarefas

- Organizar por conexões.
- Evitar sobreposição.
- Manter espaçamento.
- Preservar fluxo lógico.
- Registrar no undo/redo.
- Atualizar posições no estado.
- Atualizar `.flow.json`.

### Biblioteca recomendada

Avaliar uso de:

```txt
elkjs
```

Caso não seja implementado de imediato, deixar estrutura preparada.

### Critérios de aceite

- Botão organiza fluxo verticalmente.
- Botão organiza fluxo horizontalmente.
- Blocos não ficam sobrepostos.
- A ação pode ser desfeita.
- O usuário continua podendo mover livremente depois.

---

## 13. Fase 9 — Exportação PNG real

### Objetivo

Permitir exportar o fluxograma como imagem.

### Tarefas

- Exportar o fluxo completo.
- Não limitar ao viewport visível, salvo opção futura.
- Adicionar margem.
- Respeitar cor de fundo.
- Incluir blocos.
- Incluir setas.
- Incluir rótulos.
- Incluir ícones visíveis.
- Baixar PNG com nome do projeto.

### Critérios de aceite

- PNG é gerado de verdade.
- PNG abre no computador.
- Fluxo completo aparece.
- Fundo correto aparece.
- Labels aparecem.
- Blocos aparecem corretamente.

### Futuro

Depois adicionar:

- SVG;
- PDF;
- exportar viewport;
- exportar seleção.

---

## 14. Fase 10 — Toolbar e paleta flutuante

### Objetivo

Melhorar produtividade.

### Tarefas

- Preservar toolbar lateral.
- Preservar modo flutuante.
- Tornar paleta flutuante arrastável.
- Mostrar ferramenta ativa.
- Mostrar atalhos.
- Permitir recolher/expandir.
- Evitar poluição visual.

### Ferramentas neutras

A toolbar deve oferecer:

- selecionar;
- bloco;
- forma;
- linha;
- seta;
- conectar;
- texto;
- cor;
- ícone;
- organizar;
- importar;
- exportar;
- PNG;
- grid;
- snap;
- atalhos;
- modo apresentação.

### Regra importante

A toolbar não deve ter categorias semânticas como:

- IA;
- Banco;
- API;
- Usuário;
- Documento técnico.

O usuário define o significado dos blocos.

### Critérios de aceite

- Toolbar é clara.
- Atalhos aparecem.
- Alternância lateral/flutuante funciona.
- Paleta flutuante pode ser movida ou preparada para isso.

---

## 15. Fase 11 — Modo apresentação editável

### Objetivo

Permitir foco total no fluxo, sem perder edição.

### Tarefas

- Ocultar menus desnecessários.
- Expandir canvas.
- Manter edição ativa.
- Manter seleção ativa.
- Permitir arrastar blocos.
- Permitir usar atalhos.
- Manter paleta flutuante disponível.
- Modais devem ser discretos e não atrapalhar o fluxo principal.

### Critérios de aceite

- F11 ativa/desativa modo apresentação.
- Canvas fica limpo.
- Usuário ainda consegue editar.
- Paleta continua disponível.
- Esc sai de modal ou modo, conforme contexto.

---

## 16. Fase 12 — Biblioteca local de fluxos

### Objetivo

Tornar a tela inicial útil de verdade.

### Tarefas

- Listar fluxos recentes.
- Criar novo fluxo.
- Abrir fluxo.
- Importar fluxo.
- Duplicar fluxo.
- Buscar fluxo.
- Salvar referência local.
- Exibir data de atualização.
- Exibir quantidade de blocos/conexões.
- Gerar miniatura simples se viável.

### MVP local

Pode usar:

- `localStorage`;
- IndexedDB;
- arquivo de configuração futuro;
- fallback web.

### Futuro desktop

Usar arquivo local de configuração para recentes.

### Critérios de aceite

- Tela inicial não é apenas mock.
- Fluxos recentes aparecem.
- Duplicar cria cópia.
- Importar aparece na biblioteca.
- Abrir leva ao editor.

---

## 17. Fase 13 — Preparação para app desktop

### Objetivo

Preparar migração para app local instalável.

### Decisão recomendada

```txt
Electron + React + TypeScript
```

### Alternativa

```txt
Tauri + React + TypeScript
```

### Tarefas

- Criar camada `desktopBridge`.
- Separar lógica web de lógica desktop.
- Criar fallbacks web.
- Preparar APIs para:
  - salvar arquivo;
  - abrir arquivo;
  - exportar PNG;
  - listar monitores;
  - modo tela cheia;
  - janelas separadas;
  - recent files.

### Critérios de aceite

- Front continua rodando como web local.
- Código já possui abstrações para desktop.
- Nenhuma função depende diretamente de Electron dentro de componentes comuns.
- Componentes chamam uma interface abstrata.

---

## 18. Fase 14 — Electron MVP

### Objetivo

Transformar o app em desktop local.

### Tarefas

- Adicionar Electron.
- Criar processo principal.
- Criar preload seguro.
- Criar IPC.
- Abrir janela principal.
- Rodar build React dentro do Electron.
- Salvar `.flow.json` em arquivo local.
- Abrir `.flow.json` de arquivo local.
- Manter recent files.
- Criar script de dev desktop.
- Criar script de build.
- Preparar empacotamento Windows.

### Scripts desejados

```txt
npm run dev
npm run dev:desktop
npm run build
npm run build:desktop
npm run package
```

### Critérios de aceite

- App abre como janela desktop.
- Salvar arquivo local funciona.
- Abrir arquivo local funciona.
- App não precisa de internet.
- App pode ser fechado e aberto novamente.
- Fluxos salvos reabrem corretamente.

---

## 19. Fase 15 — Janelas separadas e múltiplos monitores

### Objetivo

Implementar o fluxo ideal do usuário em múltiplas telas.

### Conceito

O usuário quer:

- canvas em tela cheia em um monitor;
- paleta de ferramentas em outra janela;
- paleta podendo ficar em outro monitor;
- modo apresentação editável;
- modais derivados da paleta ou como janelas flutuantes.

### Tarefas

- Listar monitores.
- Permitir escolher monitor do canvas.
- Permitir escolher monitor da paleta.
- Criar janela principal.
- Criar janela de ferramentas.
- Permitir minimizar paleta.
- Evitar fechar paleta se canvas depender dela.
- Implementar comunicação entre janelas.
- Sincronizar ferramenta ativa.
- Sincronizar seleção.
- Sincronizar propriedades.

### Critérios de aceite

- App lista monitores.
- Canvas pode ir para tela cheia.
- Paleta pode ficar em outra janela.
- Paleta controla ferramenta ativa.
- Edição continua funcionando.
- Atalhos continuam funcionando.

---

## 20. Fase 16 — Ícones personalizados

### Objetivo

Permitir personalização visual mais livre.

### Tarefas

- Escolher ícones internos.
- Upload de ícone PNG/SVG.
- Trocar ícone de bloco.
- Remover ícone.
- Salvar referência no `.flow.json`.
- Tratar segurança de SVG.
- Criar biblioteca local futura de ícones.

### Critérios de aceite

- Usuário escolhe ícone padrão.
- Usuário troca ícone.
- Ícone é preservado ao salvar.
- Ícone é restaurado ao abrir.
- Upload personalizado é tratado com segurança.

---

## 21. Fase 17 — Refinamento de UX

### Objetivo

Deixar o app mais confortável para uso real.

### Tarefas

- Melhorar tooltips.
- Melhorar modais.
- Melhorar painéis de propriedades.
- Melhorar seleção.
- Melhorar feedback visual.
- Melhorar mensagens de erro.
- Melhorar atalhos.
- Melhorar comportamento em telas pequenas.
- Melhorar contraste.
- Melhorar foco no canvas.

### Critérios de aceite

- Interface parece limpa.
- Ações são fáceis de encontrar.
- Usuário entende o que está ativo.
- Erros são compreensíveis.
- Fluxo de edição é rápido.

---

## 22. Fase 18 — Testes

### Objetivo

Evitar regressões.

### Testes recomendados

- validação de `.flow.json`;
- normalização;
- importação;
- exportação;
- conversão para React Flow;
- conversão de React Flow;
- undo/redo;
- criação de nodes;
- criação de edges;
- remoção de nodes;
- remoção de edges;
- duplicação;
- auto-layout básico.

### Critérios de aceite

- Testes principais passam.
- Import/export não perde dados.
- JSON inválido não quebra app.
- Undo/redo não corrompe fluxo.

---

## 23. Priorização geral

### Prioridade 1 — Núcleo obrigatório

```txt
Rodar projeto
Schema .flow.json
Import/export .flow.json
Editor básico
Blocos
Setas
Informações ocultas
Undo/redo
Resize
PNG
```

### Prioridade 2 — Produtividade

```txt
Auto-layout
Atalhos
Toolbar flutuante
Modo apresentação
Biblioteca local
Duplicação
Grid/snap
```

### Prioridade 3 — Desktop

```txt
Electron
Salvar arquivo real
Abrir arquivo real
Recent files
Build Windows
App offline
```

### Prioridade 4 — Multi-monitor

```txt
Tela cheia em monitor escolhido
Janela separada de ferramentas
Sincronização entre janelas
Modais flutuantes
```

### Prioridade 5 — Avançado

```txt
Roteamento avançado
Ícones personalizados robustos
Biblioteca de ícones
SVG/PDF
Grupos
Páginas
Histórico de versões
```

---

## 24. O que não fazer em nenhuma fase inicial

Não implementar:

- login;
- cadastro;
- autenticação;
- IA interna;
- chat;
- backend remoto;
- banco remoto;
- colaboração;
- pagamento;
- landing page;
- marketplace;
- analytics;
- tracking;
- sync em nuvem;
- permissões por usuário;
- multiplayer;
- comentários colaborativos.

---

## 25. Riscos técnicos

### 25.1 React Flow e schema próprio

Risco:

- salvar objetos internos do React Flow diretamente pode prender o app à biblioteca.

Mitigação:

- manter schema próprio `.flow.json`;
- criar adapters.

### 25.2 Auto-layout complexo demais

Risco:

- tentar resolver cruzamento perfeito cedo demais.

Mitigação:

- começar com vertical/horizontal;
- usar ELK.js futuramente;
- diferenciar roteamento de setas e reorganização de blocos.

### 25.3 Electron cedo demais

Risco:

- adicionar desktop antes de estabilizar front pode complicar tudo.

Mitigação:

- primeiro estabilizar app web/local;
- depois adicionar Electron.

### 25.4 JSON externo inseguro

Risco:

- importar arquivo malformado ou perigoso.

Mitigação:

- validar;
- normalizar;
- não executar nada;
- sanitizar SVG;
- tratar erros.

### 25.5 Toolbar e múltiplas janelas

Risco:

- sincronização complexa entre janelas.

Mitigação:

- primeiro fazer paleta flutuante dentro da janela;
- depois transformar em janela separada no Electron.

---

## 26. Roadmap resumido

```txt
Fase 0  — Preparação local
Fase 1  — Auditoria técnica
Fase 2  — Schema .flow.json
Fase 3  — Import/export .flow.json real
Fase 4  — Editor básico robusto
Fase 5  — Undo/redo/delete/duplicar
Fase 6  — Resize visual
Fase 7  — Setas ortogonais
Fase 8  — Auto-layout por botão
Fase 9  — Exportação PNG real
Fase 10 — Toolbar e paleta flutuante
Fase 11 — Modo apresentação editável
Fase 12 — Biblioteca local de fluxos
Fase 13 — Preparação desktop
Fase 14 — Electron MVP
Fase 15 — Janelas separadas e múltiplos monitores
Fase 16 — Ícones personalizados
Fase 17 — Refinamento de UX
Fase 18 — Testes
```

---

## 27. Versão 0.1 — Meta realista

A primeira versão realmente utilizável deve entregar:

```txt
- criar fluxo;
- adicionar blocos;
- editar blocos;
- mover blocos;
- redimensionar blocos;
- conectar blocos;
- editar setas;
- informações ocultas;
- importar .flow.json;
- exportar .flow.json;
- exportar PNG;
- undo/redo;
- grid/snap;
- modo apresentação;
- auto-layout simples;
- app rodando localmente.
```

Não precisa ainda:

```txt
- Electron completo;
- multi-monitor;
- paleta em janela separada;
- PDF;
- SVG;
- IA interna;
- colaboração.
```

---

## 28. Versão 0.2 — Desktop local

A segunda versão deve entregar:

```txt
- Electron;
- app instalável ou executável;
- salvar arquivo local;
- abrir arquivo local;
- recent files;
- biblioteca local real;
- exportação PNG desktop;
- funcionamento offline completo.
```

---

## 29. Versão 0.3 — Apresentação e múltiplos monitores

A terceira versão deve entregar:

```txt
- modo apresentação em tela cheia;
- escolha de monitor;
- janela de ferramentas separada;
- sincronização entre canvas e paleta;
- modais flutuantes;
- melhor experiência multi-monitor.
```

---

## 30. Versão 0.4 — Organização visual avançada

A quarta versão deve entregar:

```txt
- ELK.js ou equivalente;
- auto-layout melhor;
- roteamento ortogonal mais inteligente;
- menos cruzamentos;
- handles automáticos;
- layout vertical/horizontal/compacto mais confiável.
```

---

## 31. Versão 0.5 — Personalização avançada

A quinta versão deve entregar:

```txt
- ícones personalizados;
- biblioteca local de ícones;
- estilos salvos;
- templates pessoais;
- background customizado avançado;
- temas claro/escuro.
```

---

## 32. Versão 1.0 — App pessoal estável

A versão 1.0 deve ser considerada quando o Fluxo estiver confiável para uso diário.

Critérios:

```txt
- app desktop estável;
- salvar/abrir confiável;
- import/export confiável;
- PNG confiável;
- editor fluido;
- undo/redo confiável;
- tela cheia funcional;
- documentação completa;
- schema .flow.json estável;
- sem dependência de internet.
```

---

## 33. Ordem recomendada para o Codex agora

Na próxima execução do Codex, pedir para ele seguir esta ordem:

```txt
1. Ler docs/CONSTITUICAO_DO_APP.md
2. Ler docs/SCHEMA_FLOW_JSON.md
3. Ler docs/PROMPT_CODEX.md
4. Ler docs/ROADMAP.md
5. Rodar o projeto
6. Auditar a estrutura
7. Corrigir erros
8. Consolidar schema
9. Implementar import/export real
10. Melhorar editor sem destruir o front
```

---

## 34. Regra final de priorização

Quando houver conflito entre duas ideias, escolher a que mais ajuda nestes quatro pontos:

```txt
1. clareza visual;
2. liberdade manual;
3. persistência local;
4. JSON compreensível por humanos e por IA.
```

Se uma tarefa não ajuda nenhum desses quatro pontos, ela deve ser adiada.
