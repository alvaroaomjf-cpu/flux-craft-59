# CONSTITUICAO_DO_APP.md

# Constituição do App Fluxo

## 1. Finalidade deste documento

Este documento é a constituição técnica e funcional do aplicativo **Fluxo**.

Ele deve ser lido antes de qualquer implementação relevante no projeto local chamado `fluxo`.

O objetivo é orientar o Codex ou qualquer desenvolvedor a evoluir o front-end já criado, sem recomeçar do zero, transformando-o gradualmente em um aplicativo desktop local para criação, edição, salvamento, importação e exportação de fluxogramas visuais.

Este documento define:

- a visão do produto;
- o que já existe no front-end gerado;
- o que deve ser preservado;
- o que deve ser corrigido;
- o que deve ser implementado;
- quais decisões arquiteturais devem guiar o desenvolvimento;
- quais funcionalidades pertencem ao MVP;
- quais funcionalidades devem ficar para versões futuras;
- como deve ser o formato `.flow.json`;
- quais limites não devem ser ultrapassados nesta fase.

---

## 2. Contexto de origem do projeto

O projeto `fluxo` começou como um front-end criado no Lovable.

A intenção dessa primeira etapa foi criar uma base visual e navegável, não o app final completo.

O Lovable foi usado para gerar:

- tela inicial;
- biblioteca visual de fluxos;
- tela de edição;
- canvas de fluxograma;
- blocos;
- setas;
- toolbar;
- modo apresentação;
- modais;
- importação/exportação visual de `.flow.json`;
- modal para criação de fluxo com IA externa;
- componentes iniciais de edição de nós e conexões.

O projeto atual deve ser considerado uma **maquete funcional de front-end**.

Ele já representa a direção visual e de experiência de uso desejada, mas ainda precisa ser evoluído para se tornar um app local real, com persistência em arquivo, melhor organização das conexões, exportação PNG real, janelas separadas, múltiplos monitores e empacotamento desktop.

O Codex deve analisar o código local existente antes de alterar qualquer coisa.

O projeto será trabalhado localmente na pasta:

```txt
fluxo/
```

Não assuma que há dependência de repositório remoto.

Não dependa de serviços online para o app funcionar.

---

## 3. Visão do produto

O **Fluxo** é um aplicativo pessoal, local e minimalista para desenhar fluxogramas manualmente.

Ele não é uma ferramenta de IA interna.

Ele não é um dashboard online.

Ele não é uma ferramenta colaborativa.

Ele não é um app SaaS.

Ele é uma ferramenta para ajudar o usuário a organizar visualmente fluxos, ideias, sistemas, processos, arquiteturas, decisões, rotas, automações e raciocínios.

O usuário deve conseguir abrir o app, criar blocos, conectar blocos com setas, adicionar informações ocultas, reorganizar visualmente o fluxo, exportar o projeto em `.flow.json` e exportar uma imagem PNG.

A ideia central é:

```txt
desenhar fluxos claros, com blocos livres, conexões inteligentes e informações internas que uma IA também consiga entender depois pelo JSON.
```

---

## 4. Princípios fundamentais

### 4.1 Local-first

O app deve funcionar localmente no computador do usuário.

Ele deve priorizar:

- arquivos locais;
- funcionamento offline;
- ausência de login;
- ausência de servidor obrigatório;
- ausência de banco remoto;
- ausência de dependência de internet em runtime.

### 4.2 Manual-first

O usuário quer criar fluxogramas manualmente.

O app não deve depender de IA interna para criar o fluxo.

A IA externa pode ser usada fora do app para gerar um `.flow.json`, mas o app em si não deve integrar modelos de IA nesta fase.

### 4.3 Visual-first

O foco é o canvas.

A interface deve ser simples, limpa e minimalista.

O fluxo deve ocupar o centro da experiência.

Menus, modais e ferramentas devem apoiar o desenho, não competir visualmente com ele.

### 4.4 Semântica invisível

Blocos e setas podem ter informações internas.

Essas informações não devem ficar visíveis o tempo inteiro.

Elas devem aparecer:

- no hover, como resumo;
- na seleção, como propriedades;
- no duplo clique, como edição completa.

### 4.5 JSON como fonte de verdade

O arquivo `.flow.json` deve ser a representação completa do projeto.

Ele deve servir para dois objetivos:

1. reabrir o desenho exatamente como foi salvo;
2. permitir que uma IA externa entenda todo o fluxo sem ver o desenho.

### 4.6 Evolução incremental

O Codex não deve reconstruir o app do zero se não for estritamente necessário.

A prioridade é evoluir a base atual.

Refatorar é permitido.

Destruir a estrutura visual existente sem necessidade não é permitido.

---

## 5. Público-alvo

O app será inicialmente de uso pessoal.

Não é necessário implementar:

- contas de usuário;
- permissões;
- colaboração;
- times;
- billing;
- cloud sync;
- marketplace;
- multiusuário.

Todas as decisões devem priorizar produtividade individual.

---

## 6. Nome e identidade

Nome do app:

```txt
Fluxo
```

Não criar identidade de marca complexa.

Não criar logo complexo.

Não transformar em landing page.

A interface deve usar apenas o nome “Fluxo” de forma discreta.

Estilo desejado:

```txt
minimalista, claro, limpo, produtivo e pouco poluído.
```

Tema inicial:

```txt
claro minimalista.
```

O usuário deve conseguir personalizar a cor de fundo do canvas.

Tema escuro pode ser preparado estruturalmente, mas não é prioridade do MVP.

---

## 7. O que já existe e deve ser preservado

O front-end criado pelo Lovable já possui uma base relevante.

O Codex deve verificar no código local os nomes reais dos arquivos e componentes, mas deve assumir que a base contém ou deveria conter conceitos como:

- aplicação React com TypeScript;
- uso de React Flow ou biblioteca equivalente para canvas;
- tela inicial;
- cards de fluxos recentes;
- criação de novo fluxo;
- importação de fluxo;
- modal de criação com IA externa;
- editor de fluxograma;
- canvas com grid;
- minimap;
- controles de zoom;
- blocos customizados;
- setas customizadas;
- toolbar lateral/flutuante;
- modais de edição;
- exportação/importação `.flow.json`;
- modo apresentação;
- estado local em navegador ou localStorage;
- atalhos iniciais;
- schema inicial de nós e conexões.

Essas decisões estão alinhadas com a intenção do produto e devem ser reaproveitadas.

---

## 8. O que ainda não deve ser considerado final

Mesmo que existam botões ou interfaces para essas funções, considere que as seguintes partes podem estar simuladas, incompletas ou frágeis:

- exportação PNG;
- salvamento real em arquivo local;
- abertura real de arquivos locais;
- biblioteca real de fluxos;
- duplicação real de fluxos;
- histórico de undo/redo robusto;
- auto-layout profissional;
- roteamento inteligente de setas;
- redimensionamento visual por alças;
- upload real de ícones personalizados;
- toolbar flutuante realmente arrastável;
- janelas separadas;
- escolha de monitor;
- modo tela cheia desktop;
- empacotamento como app de PC;
- integração com Electron ou Tauri.

O Codex deve transformar essas partes em implementações reais de forma gradual.

---

## 9. Escopo do MVP técnico

O MVP técnico deve entregar um app local utilizável, mesmo que ainda simples.

### 9.1 Obrigatório no MVP

O usuário deve conseguir:

- abrir o app localmente;
- ver a tela inicial;
- criar um novo fluxo;
- abrir um fluxo existente;
- importar um `.flow.json`;
- editar um fluxo;
- adicionar blocos;
- escolher formato do bloco;
- mover blocos livremente;
- redimensionar blocos;
- conectar blocos com linhas/setas;
- editar rótulo de setas;
- adicionar informações ocultas em blocos;
- adicionar informações ocultas em setas;
- selecionar elementos;
- excluir elementos;
- duplicar elementos;
- usar undo/redo;
- usar zoom e pan;
- usar grid;
- ativar/desativar snap;
- organizar fluxo por botão;
- exportar `.flow.json`;
- salvar `.flow.json` em arquivo local;
- abrir `.flow.json` de arquivo local;
- exportar PNG;
- usar modo apresentação editável;
- usar atalhos de teclado principais;
- usar o app sem internet.

### 9.2 Desejável no MVP

Se possível, implementar também:

- biblioteca local de fluxos recentes;
- duplicação de fluxo na biblioteca;
- miniatura simples do fluxo;
- arrastar toolbar flutuante;
- validação robusta de `.flow.json`;
- recuperação de projeto após fechamento inesperado;
- exportação com nome sugerido;
- tela cheia real no desktop.

### 9.3 Fora do MVP

Não implementar ainda:

- login;
- IA interna;
- colaboração;
- cloud sync;
- backend remoto;
- banco de dados remoto;
- marketplace de ícones;
- sistema de plugins;
- múltiplos projetos abertos simultaneamente;
- versionamento avançado de fluxos;
- comentários colaborativos;
- permissões por usuário;
- pagamentos;
- landing page;
- app mobile.

---

## 10. Direção arquitetural

### 10.1 Front-end

Manter React + TypeScript.

Manter ou consolidar React Flow como motor visual principal do canvas, salvo se houver motivo técnico muito forte para trocar.

O front deve ser modular e separado por responsabilidades.

### 10.2 Desktop

A etapa posterior deve transformar o app em um aplicativo desktop local.

A opção recomendada é:

```txt
Electron + React + TypeScript
```

Alternativa aceitável:

```txt
Tauri + React + TypeScript
```

Escolher uma das duas apenas após avaliar o projeto local e as necessidades de:

- salvamento em arquivos;
- abertura de arquivos;
- exportação PNG;
- janelas separadas;
- múltiplos monitores;
- tela cheia;
- build para Windows.

Para este projeto, Electron tende a ser mais direto por causa de janelas separadas, controle de monitores e integração com APIs desktop.

### 10.3 Persistência

A persistência final deve ser em arquivos locais `.flow.json`.

`localStorage` pode ser usado apenas como:

- cache temporário;
- autosave de emergência;
- preferências do usuário;
- último projeto aberto.

O arquivo `.flow.json` deve ser a fonte portátil do projeto.

### 10.4 Backend local

Não criar servidor web remoto.

Se houver necessidade de backend, ele deve ser o processo principal do Electron ou camada local equivalente.

Funções de backend local:

- salvar arquivo;
- abrir arquivo;
- listar fluxos recentes;
- exportar PNG;
- gerenciar janelas;
- listar monitores;
- abrir modo apresentação;
- controlar pasta de biblioteca local;
- validar permissões de arquivo;
- manter autosave local.

---

## 11. Estrutura recomendada de pastas

A estrutura atual pode ser diferente. O Codex deve adaptar sem quebrar o app.

Estrutura ideal de referência:

```txt
fluxo/
  docs/
    CONSTITUICAO_DO_APP.md
    PROMPT_CODEX.md
    SCHEMA_FLOW_JSON.md
    ROADMAP.md

  src/
    app/
      routes/
      providers/

    components/
      canvas/
        FlowCanvas.tsx
        CustomNode.tsx
        CustomEdge.tsx
        NodeResizeControls.tsx
        ConnectionHandles.tsx
        CanvasBackground.tsx
        CanvasMinimap.tsx

      toolbar/
        ToolPalette.tsx
        FloatingToolbar.tsx
        SideToolbar.tsx
        ToolButton.tsx

      modals/
        NodeEditorModal.tsx
        EdgeEditorModal.tsx
        ImportFlowModal.tsx
        ExportFlowModal.tsx
        ExternalAiFlowModal.tsx
        ShortcutHelpModal.tsx
        VisualSettingsModal.tsx

      home/
        HomePage.tsx
        FlowCard.tsx
        FlowLibrary.tsx

      common/
        IconPicker.tsx
        ColorPicker.tsx
        FloatingWindow.tsx
        KeyboardShortcutLabel.tsx

    features/
      flow/
        flowStore.ts
        flowTypes.ts
        flowSchema.ts
        flowDefaults.ts
        flowValidation.ts
        flowSerialization.ts
        flowImportExport.ts

      layout/
        autoLayout.ts
        elkLayout.ts
        edgeRouting.ts

      history/
        undoRedo.ts

      export/
        exportPng.ts

      desktop/
        desktopBridge.ts

    styles/
      globals.css
      theme.css

  electron/
    main.ts
    preload.ts
    windows/
      createMainWindow.ts
      createToolboxWindow.ts
      createPresentationWindow.ts
    ipc/
      fileIpc.ts
      windowIpc.ts
      displayIpc.ts
    filesystem/
      saveFlowFile.ts
      openFlowFile.ts
      recentFlows.ts
    export/
      exportPng.ts
```

Não é obrigatório criar tudo de uma vez.

Priorize evolução incremental.

---

## 12. Modelo mental do aplicativo

O app possui três camadas conceituais:

### 12.1 Camada visual

Responsável por:

- blocos;
- setas;
- formas;
- cores;
- tamanhos;
- posições;
- zoom;
- grid;
- canvas;
- modo apresentação;
- toolbar;
- modais.

### 12.2 Camada semântica

Responsável por:

- objetivo dos blocos;
- entradas;
- saídas;
- regras;
- observações;
- condições;
- prioridades;
- informações ocultas;
- informações úteis para IA externa.

### 12.3 Camada de persistência

Responsável por:

- `.flow.json`;
- salvar;
- abrir;
- duplicar;
- importar;
- exportar;
- autosave;
- recuperação;
- biblioteca local.

Essas camadas devem estar claramente separadas no código.

---

## 13. Formato `.flow.json`

A extensão oficial do arquivo de projeto será:

```txt
.flow.json
```

Esse arquivo é JSON normal com extensão própria.

Ele deve conter tudo necessário para:

1. reabrir o desenho igual;
2. preservar informações ocultas;
3. permitir que uma IA externa entenda o fluxo;
4. preservar metadados do projeto;
5. preservar configurações visuais;
6. preservar viewport;
7. preservar blocos;
8. preservar conexões.

### 13.1 Exemplo estrutural

```json
{
  "app": "Fluxo",
  "schemaVersion": "0.1.0",
  "project": {
    "id": "flow-uuid",
    "name": "Nome do Fluxo",
    "description": "Descrição opcional do projeto",
    "createdAt": "2026-06-16T00:00:00.000Z",
    "updatedAt": "2026-06-16T00:00:00.000Z",
    "background": "#f8fafc",
    "viewport": {
      "x": 0,
      "y": 0,
      "zoom": 1
    },
    "settings": {
      "theme": "light",
      "gridVisible": true,
      "snapToGrid": true,
      "gridSize": 20,
      "layoutDirection": "vertical"
    }
  },
  "nodes": [],
  "edges": []
}
```

### 13.2 Node

Cada nó deve conter:

```json
{
  "id": "node-1",
  "type": "flowNode",
  "shape": "rounded-rectangle",
  "title": "Título do bloco",
  "summary": "Resumo curto",
  "hiddenInfo": "Informação oculta completa",
  "position": {
    "x": 100,
    "y": 100
  },
  "size": {
    "width": 180,
    "height": 80
  },
  "style": {
    "backgroundColor": "#ffffff",
    "borderColor": "#d1d5db",
    "textColor": "#111827",
    "borderWidth": 1,
    "borderRadius": 12,
    "shadow": "sm"
  },
  "icon": {
    "type": "default",
    "name": "circle",
    "customSrc": null
  },
  "semantic": {
    "objective": "",
    "inputs": [],
    "outputs": [],
    "rules": [],
    "notes": ""
  },
  "customFields": []
}
```

### 13.3 Edge

Cada conexão deve conter:

```json
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "sourceHandle": "right",
  "targetHandle": "left",
  "label": "Continuar",
  "hiddenInfo": "Informação oculta da conexão",
  "type": "orthogonal",
  "style": {
    "stroke": "#374151",
    "strokeWidth": 2,
    "strokeDasharray": null,
    "markerEnd": "arrow"
  },
  "routing": {
    "mode": "auto",
    "points": [],
    "avoidCrossings": true
  },
  "semantic": {
    "condition": "",
    "priority": "normal",
    "rules": [],
    "notes": ""
  },
  "customFields": []
}
```

### 13.4 Custom field

Campos personalizados podem ser usados depois:

```json
{
  "key": "risco",
  "label": "Risco",
  "value": "Alto"
}
```

### 13.5 Validação

Toda importação de `.flow.json` deve validar:

- se o JSON é válido;
- se `app` é `"Fluxo"` ou compatível;
- se `schemaVersion` existe;
- se `nodes` é array;
- se `edges` é array;
- se cada node tem `id`;
- se cada edge tem `source` e `target`;
- se `source` e `target` apontam para nodes existentes;
- se posições são numéricas;
- se tamanhos são válidos;
- se cores são strings válidas ou fallback seguro.

Importações inválidas devem exibir erro amigável.

Nunca quebrar o app por causa de JSON ruim.

---

## 14. Tela inicial

A tela inicial deve ser simples e funcional.

Ela representa a biblioteca local.

Deve conter:

- título “Fluxo”;
- botão “Criar novo fluxo”;
- botão “Importar fluxo .flow.json”;
- botão “Criar fluxo com IA externa”;
- busca;
- cards de fluxos recentes;
- botão abrir;
- botão duplicar;
- informação de data de atualização;
- miniatura simples se possível.

A biblioteca deve funcionar com um projeto aberto por vez.

Não implementar múltiplos projetos simultâneos nesta fase.

### 14.1 Criar novo fluxo

Deve criar um projeto vazio com:

- nome padrão;
- viewport padrão;
- background claro;
- grid ativo;
- snap ativo;
- nodes vazios;
- edges vazias.

### 14.2 Importar fluxo

Deve permitir selecionar ou colar `.flow.json`.

Após importar, validar e abrir no editor.

### 14.3 Duplicar fluxo

Duplicar deve criar uma cópia do arquivo/projeto com novo `id`, novo nome sugerido e nova data.

---

## 15. Modal “Criar fluxo com IA externa”

Esse modal fica na tela inicial, não na toolbar do editor.

Ele serve para orientar o usuário a usar uma IA externa.

O app não chama IA.

O modal deve conter:

- explicação curta;
- prompt para copiar;
- botão copiar prompt;
- botão baixar exemplo `.flow.json`;
- campo para colar JSON retornado pela IA;
- botão validar;
- botão importar e abrir;
- área de erro;
- exemplo do formato aceito.

### 15.1 Prompt oficial

O prompt oficial deve orientar a IA externa a **não gerar JSON imediatamente**.

Prompt:

```txt
Você vai me ajudar a criar um fluxograma para ser importado no app Fluxo.

Antes de gerar qualquer JSON, apenas responda: “Entendi. Estou pronto para receber o contexto do fluxo.”

Depois disso, aguarde meu próximo comando.

Quando eu enviar o contexto, você deve me ajudar a organizar teoricamente o fluxo, fazer perguntas se necessário e só gerar o JSON quando eu pedir explicitamente.

O JSON final deve representar blocos, formas, setas, rótulos, informações ocultas, posição visual aproximada e conexões entre os elementos.

Não gere o JSON agora.
Apenas confirme que entendeu e aguarde.
```

### 15.2 Regras desse modal

- não deve aparecer dentro do editor;
- não deve ficar na toolbar;
- não deve depender de IA interna;
- deve aceitar JSON colado manualmente;
- deve permitir baixar exemplo;
- deve validar antes de importar.

---

## 16. Editor de fluxograma

A tela do editor é o centro do app.

Ela deve conter:

- canvas infinito;
- grid discreto;
- zoom;
- pan;
- minimap;
- controles;
- toolbar lateral ou flutuante;
- modais de edição;
- modo apresentação;
- import/export;
- atalhos.

O editor deve permitir liberdade visual.

O usuário decide:

- posição dos blocos;
- tamanho dos blocos;
- formato dos blocos;
- cor dos blocos;
- significado dos blocos;
- significado das setas.

O app não deve impor categorias semânticas como “IA”, “Banco”, “API”, “Usuário”.

As ferramentas devem ser neutras:

- bloco;
- forma;
- linha;
- seta;
- conexão;
- texto;
- cor;
- ícone.

---

## 17. Blocos

### 17.1 Formas iniciais

O usuário deve poder escolher:

- retângulo;
- retângulo arredondado;
- círculo;
- losango;
- cilindro;
- hexágono.

Nenhuma forma deve ter significado fixo.

### 17.2 Campos visíveis

O bloco deve exibir:

- título;
- ícone opcional;
- talvez um resumo muito curto, se visualmente viável.

### 17.3 Campos ocultos

O bloco deve guardar:

- descrição curta;
- informação oculta;
- objetivo;
- entradas;
- saídas;
- regras;
- observações.

### 17.4 Exibição de informações ocultas

- hover: tooltip pequeno;
- seleção: propriedades resumidas;
- duplo clique: modal completo.

### 17.5 Personalização

O usuário deve poder alterar:

- título;
- formato;
- largura;
- altura;
- cor de fundo;
- cor da borda;
- cor do texto;
- ícone;
- descrição;
- informação oculta;
- campos semânticos.

### 17.6 Redimensionamento

Deve ser possível redimensionar visualmente com alças.

Também pode haver campos numéricos em modal.

Regras:

- largura e altura independentes;
- permitir alongar;
- permitir achatar;
- respeitar tamanho mínimo;
- opção futura de travar proporção.

---

## 18. Ícones

Cada bloco pode ter ícone.

Tipos de ícone:

- padrão interno;
- personalizado.

MVP:

- escolher de biblioteca interna;
- remover ícone;
- trocar ícone;
- upload local simples de PNG/SVG se viável.

Futuro:

- biblioteca local de ícones personalizados;
- reuso de ícones em vários projetos.

O ícone não define o significado do bloco.

O usuário define o significado manualmente.

---

## 19. Linhas e setas

### 19.1 Tipos

O app deve suportar:

- linha simples;
- seta simples;
- conexão com rótulo;
- conexão sem seta;
- linha pontilhada;
- linha contínua.

### 19.2 Estilo principal

O estilo principal deve ser:

```txt
angular / ortogonal / fluxograma profissional
```

### 19.3 Informações da seta

Cada seta pode ter:

- rótulo visível;
- informação oculta;
- condição;
- regra;
- prioridade;
- observações.

### 19.4 Exibição

- hover: tooltip;
- seleção: painel/propriedades;
- duplo clique: modal completo.

### 19.5 Comportamento ao mover blocos

Quando o usuário mover um bloco:

- as conexões ligadas devem acompanhar;
- as conexões devem recalcular visualmente o melhor lado de entrada/saída quando possível;
- as conexões devem tentar evitar caminhos confusos;
- as conexões não devem mover outros blocos automaticamente.

### 19.6 Organização manual

O app só deve reorganizar blocos quando o usuário clicar no botão:

```txt
Organizar fluxo
```

Não reorganizar os blocos automaticamente durante a edição comum.

---

## 20. Pontos de conexão

Usar abordagem híbrida.

Regras:

- mostrar pontos discretos quando o bloco estiver selecionado ou em hover;
- pontos básicos: topo, direita, baixo e esquerda;
- permitir arrastar conexão desses pontos;
- permitir que o sistema escolha melhor lado em roteamento futuro;
- preservar handles no `.flow.json` quando fizer sentido.

---

## 21. Organização automática

Botão:

```txt
Organizar fluxo
```

Opções:

- vertical;
- horizontal;
- radial;
- compacto.

### 21.1 MVP

No MVP, implementar pelo menos:

- vertical;
- horizontal.

### 21.2 Layout profissional

Recomendado usar ELK.js ou biblioteca equivalente para:

- organizar em camadas;
- reduzir cruzamentos;
- manter espaçamento;
- respeitar conexões;
- evitar sobreposição;
- gerar layout legível.

### 21.3 Regra importante

Auto-layout move blocos.

Roteamento de setas move linhas.

Esses dois comportamentos são diferentes.

Ao arrastar blocos manualmente, só as linhas devem se adaptar.

Ao clicar em “Organizar fluxo”, blocos também podem ser reposicionados.

---

## 22. Toolbar

A toolbar deve ter dois modos:

- lateral fixa;
- paleta flutuante.

O usuário deve poder alternar entre os dois.

A toolbar não deve ter categorias complexas.

Ela deve ser simples, focada em:

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

### 22.1 Botões com atalhos visíveis

Cada ferramenta importante deve mostrar:

- ícone;
- nome curto;
- atalho.

Exemplos:

```txt
Selecionar — V
Bloco — B
Forma — F
Linha — L
Seta — A
Conectar — C
Texto — T
Organizar — Ctrl+L
Salvar — Ctrl+S
```

### 22.2 Paleta flutuante

A paleta flutuante deve ser movível.

No futuro desktop, ela poderá ser uma janela separada.

No MVP web/local, pode ser um painel arrastável dentro da janela.

---

## 23. Modo apresentação editável

O modo apresentação não é apenas visualização passiva.

Ele deve permitir edição.

Objetivo:

- deixar o canvas limpo;
- esconder menus desnecessários;
- manter foco no fluxo;
- permitir mover blocos;
- permitir selecionar elementos;
- permitir editar via paleta;
- permitir atalhos;
- permitir modais flutuantes.

### 23.1 Em desktop

Na versão desktop, o ideal é:

- canvas em tela cheia em um monitor;
- paleta de ferramentas em janela separada;
- paleta podendo ficar em outro monitor;
- modais saindo da paleta ou como janelas flutuantes;
- canvas sem interface poluída.

### 23.2 Em modo monotela

Também deve existir modo normal em uma única tela.

O usuário deve poder alternar entre:

- edição comum;
- apresentação editável;
- tela cheia futura com paleta separada.

---

## 24. Janelas e múltiplos monitores

Esta parte pertence principalmente à versão desktop.

Quando Electron/Tauri for implementado, o app deve suportar:

- janela principal;
- janela/paleta de ferramentas;
- modo tela cheia no monitor escolhido;
- listagem de monitores;
- posicionamento da paleta em outro monitor;
- modais flutuantes.

### 24.1 Janela principal

Responsável por:

- canvas;
- fluxo;
- edição visual;
- apresentação.

### 24.2 Janela/paleta de ferramentas

Responsável por:

- ferramenta ativa;
- criação de blocos;
- edição de propriedades;
- seleção de cores;
- seleção de ícones;
- exportação/importação;
- atalhos;
- modais auxiliares.

### 24.3 Regra importante

A paleta não deve ser fechada enquanto houver fluxo aberto em modo apresentação com canvas dependente dela.

Ela pode ser minimizada.

---

## 25. Atalhos de teclado

Implementar atalhos úteis e consistentes.

Atalhos recomendados:

```txt
V               Selecionar / mover
B               Criar bloco
F               Criar forma
L               Criar linha
A               Criar seta
C               Conectar
T               Editar texto
I               Trocar ícone
R               Redimensionar
G               Ligar/desligar grid
S               Ligar/desligar snap, exceto quando combinado com Ctrl
Ctrl+S          Salvar / exportar projeto .flow.json
Ctrl+O          Abrir / importar projeto
Ctrl+E          Exportar
Ctrl+P          Exportar PNG
Ctrl+L          Organizar fluxo
Ctrl+Z          Desfazer
Ctrl+Y          Refazer
Ctrl+D          Duplicar seleção
Ctrl+A          Selecionar tudo
Delete          Excluir seleção
Esc             Cancelar ação atual ou fechar modal
Espaço+arrastar Mover canvas
+               Zoom in
-               Zoom out
Ctrl+0          Ajustar fluxo à tela
F11             Modo apresentação
Shift+arrastar  Mover em linha reta
Alt+arrastar    Duplicar bloco
```

Se algum atalho conflitar com o navegador durante desenvolvimento web, tratar depois na versão desktop.

---

## 26. Undo e redo

Undo/redo deve ser real.

Deve cobrir:

- criação de bloco;
- remoção de bloco;
- movimento de bloco;
- redimensionamento;
- edição de propriedades;
- criação de seta;
- remoção de seta;
- edição de seta;
- mudança de cor;
- mudança de ícone;
- organização automática.

Implementar com pilha de histórico.

Evitar registrar histórico excessivo a cada pixel arrastado.

Registrar movimento ao final do drag.

---

## 27. Grid e snap

O canvas deve ter:

- grid discreto;
- opção de ligar/desligar;
- snap opcional;
- ajuste de tamanho do grid;
- persistência dessas preferências no projeto.

O fundo do canvas deve ser personalizável.

---

## 28. Exportação PNG

A exportação PNG deve ser real.

Requisitos:

- exportar o canvas visível ou o fluxo completo;
- preferir exportar o fluxo completo com margem;
- respeitar background;
- respeitar blocos, setas, rótulos e ícones;
- sugerir nome baseado no projeto;
- não depender de servidor.

Pode usar bibliotecas client-side compatíveis, desde que funcionem no app desktop/local.

---

## 29. Importação e exportação `.flow.json`

### 29.1 Exportar

Ao exportar:

- gerar `.flow.json`;
- incluir todos os dados visuais;
- incluir todos os dados semânticos;
- incluir informações ocultas;
- incluir viewport;
- incluir configurações do projeto;
- usar schema versionado.

### 29.2 Importar

Ao importar:

- validar JSON;
- normalizar dados ausentes;
- aplicar defaults seguros;
- abrir no editor;
- mostrar erros claros;
- nunca travar a aplicação.

### 29.3 Compatibilidade

O app deve ser tolerante com versões anteriores.

Se `schemaVersion` for antiga, tentar migrar.

Criar camada de migração futuramente.

---

## 30. Biblioteca local de fluxos

Na versão final local, a tela inicial deve listar fluxos recentes.

Possíveis fontes:

- lista mantida em configuração local;
- pasta padrão de biblioteca;
- arquivos abertos recentemente.

MVP pode começar com:

- recent files em JSON local;
- localStorage temporário;
- ou configuração local via Electron.

A biblioteca deve permitir:

- abrir;
- duplicar;
- importar;
- criar novo;
- buscar.

Não precisa suportar múltiplos projetos abertos ao mesmo tempo.

---

## 31. Segurança e confiabilidade

O app deve tratar arquivos externos com cuidado.

Regras:

- nunca executar código vindo de `.flow.json`;
- tratar ícones SVG com segurança;
- validar strings;
- limitar tamanho de arquivos importados;
- evitar travar com JSON gigante;
- sanitizar conteúdo exibido em tooltips/modais;
- mostrar erro amigável.

---

## 32. Performance

O app deve funcionar bem com pelo menos:

```txt
100 blocos
200 conexões
```

Meta futura:

```txt
500 blocos
1000 conexões
```

Evitar:

- renders desnecessários;
- recalcular layout continuamente;
- recalcular roteamento pesado a cada pixel;
- salvar a cada microalteração sem debounce;
- tooltips pesados.

---

## 33. Regras para o Codex

### 33.1 Antes de implementar

O Codex deve:

1. ler este documento;
2. analisar o projeto local `fluxo`;
3. identificar a stack real;
4. identificar rotas existentes;
5. identificar componentes existentes;
6. identificar o estado atual;
7. identificar o schema atual;
8. identificar o que está simulado;
9. propor um plano de implementação incremental;
10. executar sem destruir o front existente.

### 33.2 Não recomeçar do zero

Não substituir toda a aplicação sem necessidade.

Preservar:

- visual geral;
- tela inicial;
- editor;
- toolbar;
- modais;
- schema conceitual;
- fluxo de navegação;
- componentes úteis.

Refatorar apenas onde houver ganho claro.

### 33.3 Priorizar funcionalidade local real

Prioridades:

1. estabilizar front;
2. fortalecer schema;
3. implementar import/export robusto;
4. implementar undo/redo real;
5. implementar exportação PNG real;
6. implementar resize visual;
7. melhorar auto-layout;
8. implementar desktop local;
9. implementar janelas e monitores.

### 33.4 Marcar TODOs

Quando uma função não puder ser concluída, marcar claramente:

```ts
// TODO: implementar ...
```

Mas evitar deixar TODOs em funcionalidades críticas do MVP sem justificativa.

### 33.5 Não adicionar complexidade desnecessária

Não adicionar:

- autenticação;
- servidor remoto;
- banco remoto;
- IA interna;
- pagamento;
- colaboração;
- analytics;
- tracking;
- cloud.

---

## 34. Critérios de aceite do MVP

O MVP estará aceitável quando:

- `npm install` funcionar;
- `npm run dev` funcionar;
- app abrir localmente;
- tela inicial funcionar;
- criar novo fluxo funcionar;
- importar `.flow.json` funcionar;
- exportar `.flow.json` funcionar;
- editor abrir fluxo;
- blocos puderem ser criados;
- blocos puderem ser movidos;
- blocos puderem ser redimensionados visualmente;
- blocos puderem ser editados;
- formas puderem ser alteradas;
- cores puderem ser alteradas;
- ícones puderem ser escolhidos;
- conexões puderem ser criadas;
- conexões puderem ter rótulo;
- conexões puderem ter informação oculta;
- informações ocultas aparecerem no hover/seleção;
- undo/redo funcionar;
- delete funcionar;
- duplicar funcionar;
- grid/snap funcionar;
- organizar fluxo funcionar ao menos em vertical/horizontal;
- PNG exportar de verdade;
- `.flow.json` reabrir mantendo dados;
- modo apresentação funcionar;
- app não depender de internet para uso básico.

---

## 35. Ordem recomendada de implementação

### Etapa 1 — Auditoria e limpeza

- rodar projeto;
- corrigir erros;
- mapear componentes;
- remover código morto se houver;
- padronizar tipos.

### Etapa 2 — Schema e validação

- consolidar tipos de `FlowProject`, `FlowNode`, `FlowEdge`;
- criar validação;
- criar defaults;
- criar normalização;
- criar exemplo oficial.

### Etapa 3 — Editor real

- melhorar criação de blocos;
- melhorar edição;
- melhorar conexões;
- implementar resize visual;
- implementar propriedades de edge;
- implementar tooltips.

### Etapa 4 — Histórico

- undo/redo robusto;
- duplicação;
- delete;
- seleção múltipla se viável.

### Etapa 5 — Import/export

- `.flow.json` real;
- validação;
- download;
- upload;
- erros amigáveis.

### Etapa 6 — PNG

- exportação PNG real;
- fluxo completo com margem;
- background correto.

### Etapa 7 — Layout

- melhorar auto-layout;
- integrar ELK.js se possível;
- vertical/horizontal;
- preparar radial/compacto.

### Etapa 8 — Desktop

- adicionar Electron/Tauri;
- salvar arquivo local;
- abrir arquivo local;
- recent files;
- empacotamento Windows.

### Etapa 9 — Janelas e monitores

- janela/paleta separada;
- tela cheia;
- escolher monitor;
- apresentação editável multi-monitor.

---

## 36. Decisões finais desta versão

Decisões já tomadas:

- app se chama **Fluxo**;
- uso pessoal inicialmente;
- foco em criação manual;
- sem IA interna;
- sem backend remoto;
- sem login;
- sem colaboração;
- formato principal: `.flow.json`;
- exportações iniciais: `.flow.json` e PNG;
- tema inicial claro minimalista;
- canvas com background personalizável;
- blocos sem categorias fixas;
- formas neutras;
- toolbar sem categorias semânticas;
- informações ocultas em blocos e setas;
- modo apresentação editável;
- auto-layout por botão;
- setas ortogonais como estilo principal;
- projeto aberto: apenas um por vez;
- biblioteca local de fluxos;
- futura versão desktop local.

---

## 37. Frase-guia para decisões futuras

Sempre que houver dúvida, priorizar:

```txt
Clareza visual, liberdade manual, persistência local e JSON compreensível por humanos e por IA.
```

Se uma funcionalidade deixar o app mais poluído, mais complexo ou mais dependente de internet, ela deve ser adiada.

Se uma funcionalidade ajuda o usuário a entender melhor o fluxo visualmente, ela deve ser considerada prioridade.

---

## 38. Próximos documentos recomendados

Depois deste arquivo, criar separadamente:

```txt
docs/SCHEMA_FLOW_JSON.md
docs/PROMPT_CODEX.md
docs/ROADMAP.md
```

Este arquivo é a constituição.

Os próximos documentos devem detalhar:

- schema exato;
- prompt de execução para o Codex;
- roadmap por fases.
