# Contribuindo com o UTI Toolkit

Obrigado pelo interesse! Este projeto é feito por e para quem trabalha na UTI.
**Você não precisa saber programar para contribuir** — as contribuições clínicas
são as mais valiosas.

## Como contribuir sem saber programar

### 1. Validação clínica (contribuição mais valiosa)

Revise as fórmulas, doses e intervalos do app contra fontes de referência
(artigos, guidelines, protocolos da sua instituição) e reporte divergências.

Como fazer:

1. Escolha uma ferramenta no [app publicado](https://p-ofjardim.github.io/uti-toolkit-mjardim/).
2. Confira os cálculos e doses exibidos na seção "Explicação" de cada tela.
3. Se algo divergir da literatura, abra uma issue
   ["Reportar problema"](https://github.com/p-ofjardim/uti-toolkit-mjardim/issues/new?template=bug-report.yml)
   anexando a referência.

Issues de revisão clínica são marcadas com o label `área: conteúdo`.

### 2. Sugestões de fármacos e diluições padrão

O banco de infusão aceita contribuições de novos fármacos e diluições padrão.
Abra uma issue
["Sugestão de nova calculadora/ferramenta"](https://github.com/p-ofjardim/uti-toolkit-mjardim/issues/new?template=feature-request.yml)
com nome do fármaco, diluição usual em sua UTI e referência.

### 3. Revisão de redação e terminologia

A evolução clínica gerada pelo app usa terminologia em português do Brasil.
Revise a redação, abreviações e nomenclatura e reporte melhorias —
issues de redação também recebem `área: conteúdo`.

### 4. Testes de instalação

Instale o app em dispositivos reais e reporte o resultado
("instalou e funcionou offline" já é um relato útil):

- Firefox para Android (PWA e extensão)
- Safari no iPhone / iPad (Adicionar à Tela de Início)
- Chrome no Android (banner "Instalar")

### Onde enviar feedback

- **Discussões e dúvidas de uso** (sem formato, sem conta técnica):
  [GitHub Discussions](https://github.com/p-ofjardim/uti-toolkit-mjardim/discussions)
- **Problemas e sugestões** (formulário guiado):
  [Issues](https://github.com/p-ofjardim/uti-toolkit-mjardim/issues/new/choose)
- **Dentro do app**: cada tela tem o link "Esta estimativa parece errada? Avise-nos".

Labels usados para organizar contribuições não técnicas:

| Label | Significado |
|---|---|
| `área: conteúdo` | Revisão clínica, redação ou terminologia |
| `good first issue` | Adequada para estreantes (técnicos ou não) |
| `triage` | Requer triagem inicial da maintainance |

## Contribuindo com código

### Pré-requisitos

- Node.js 18+

### Fluxo

```bash
npm install
npm test          # roda os testes unitários (obrigatório antes do commit)
npm run build     # regenera public/, docs/ e extension/ a partir de src/
```

Regras do projeto:

1. **`src/` é a fonte única de verdade.** Nunca edite `public/`, `docs/` ou
   `extension/` diretamente — eles são gerados pelo build e o CI verifica a
   sincronização (`git diff --exit-code -- public docs extension`).
2. **Cada cálculo é uma pure function** em um arquivo próprio sob
   `src/tools/<ferramenta>/calculations/`, com testes em `__tests__/` ao lado.
3. **Sem JS/CSS inline no `src/`** — o bundle é gerado pelo build, compatível
   com a CSP da extensão Firefox MV2.
4. **Event delegation** via `data-field`/`data-action`; sem `onclick` inline.

### Pull requests

1. Crie um branch a partir de `main`.
2. Descreva a mudança e a referência clínica que apoia o cálculo, se houver.
3. Garanta que `npm test` e `npm run build && git diff --exit-code` passam.
