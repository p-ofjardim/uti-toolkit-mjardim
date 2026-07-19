# UTI Toolkit – MJardim Serviços Médicos

Calculadoras clínicas para UTI, empacotadas como **PWA instalável** (Android e iOS) e **extensão Firefox** (desktop e Android).

---

## Ferramentas disponíveis

| Ferramenta | Descrição |
|---|---|
| **Ventilação Mecânica** | Volume minuto, relação I:E, complacência, resistência, driving pressure, P/F ratio, gasometria, ajuste de FR/VT/VE, RSBI, CROP index e checklists de desmame/extubação |
| **RSI – Sequência Rápida de Intubação** | Doses de indução e bloqueio neuromuscular calculadas pelo peso do paciente |
| **Infusão de Medicamentos** | Taxa de infusão (mL/h) e dose total para vasopressores, sedativos e outros fármacos de UTI; banco de diluições padrão |
| **Água Livre e Sódio** | Déficit de água livre pela fórmula de Adrogue-Madias (NEJM); orientação de correção para hipo e hipernatremia |
| **Evolução Clínica** | Gerador de texto de evolução estruturada por sistemas (hemodinâmica, ventilação, neurologia, diurese, etc.) com adaptação de gênero |

---

## Arquitetura

```
.
├── public/                  # PWA (servida pelo Node.js)
│   ├── index.html           # Shell: cabeçalho, nav inferior, iframes por ferramenta
│   ├── manifest.json        # Web App Manifest (nome, ícones, display standalone)
│   ├── sw.js                # Service Worker — cache-first para uso offline
│   ├── icons/               # SVG 192 px e 512 px
│   └── tools/               # Páginas das ferramentas (HTML auto-contido)
│       ├── ventilacao.html
│       ├── rsi.html
│       ├── infusao.html
│       ├── agua-livre.html
│       └── evolucao.html
│
├── extension/               # Extensão Firefox (MV2)
│   ├── manifest.json        # MV2, gecko id, data_collection_permissions
│   ├── background.js        # Abre/foca aba dedicada ao clicar no ícone
│   ├── index.html           # Shell da extensão (sem PWA/SW)
│   ├── app.js               # JS extraído de index.html pelo build
│   ├── icons/               # SVG 48 px, 96 px, 128 px
│   ├── tools/               # Cópias das ferramentas adaptadas para MV2
│   │   ├── *.html           # Sem blocos <script> inline
│   │   └── *.js             # Scripts extraídos + event delegation
│   └── LICENSE
│
├── server.js                # Servidor Node.js (http nativo) — porta 5000
├── build-extension.js       # Build: extrai scripts, converte onclick → data-fn, gera .xpi
└── uti-toolkit-firefox.xpi  # Pacote pronto para submissão ao AMO
```

### Por que iframes no shell?

Cada ferramenta tem IDs de DOM repetidos (ex.: `peso`, `resultado`). O shell de iframes isola os contextos JavaScript sem necessidade de refatorar os arquivos individuais.

### Compliance Firefox MV2

O Firefox MV2 proíbe `'unsafe-inline'` em `script-src`. O `build-extension.js` resolve isso automaticamente:
1. Extrai blocos `<script>` para arquivos `.js` externos
2. Converte `onclick="fn(arg)"` → `data-fn="fn" data-arg="arg"`
3. Injeta um listener de event delegation em cada `.js`
4. Empacota tudo como `.xpi`

---

## Instalação

### Como PWA — Android

1. Acesse o app no Chrome
2. Toque no banner **"Instalar"** ou vá em **Menu → Adicionar à tela inicial**
3. O app fica disponível offline após a primeira visita

### Como PWA — iPhone / iPad (Safari)

1. Acesse o app no Safari
2. Toque em **Compartilhar → Adicionar à Tela de Início**
3. Confirme o nome e toque em **Adicionar**

> O Safari não exibe prompt automático de instalação — o passo manual acima é obrigatório no iOS.

### Como extensão Firefox

1. Baixe `uti-toolkit-firefox.xpi`
2. No Firefox, acesse `about:addons` → ícone de engrenagem → **Instalar extensão a partir de arquivo…**
3. Selecione o `.xpi` e confirme

Para instalar no **Firefox para Android**: acesse `about:addons` → menu de três pontos → **Instalar extensão a partir de arquivo**.

---

## Desenvolvimento

### Pré-requisitos

- Node.js 18+

### Rodar localmente

```bash
node server.js
# Acesse http://localhost:5000
```

### Gerar o `.xpi`

```bash
node build-extension.js
# Saída: uti-toolkit-firefox.xpi
```

> **Importante:** o `build-extension.js` extrai scripts do HTML **apenas na primeira execução** (quando os blocos `<script>` ainda existem nos `.html`). Em execuções subsequentes ele preserva os `.js` já gerados. Para regenerar do zero, copie os arquivos de `public/tools/` para `extension/tools/` antes de rodar.

### Adicionar uma nova ferramenta

1. Crie `public/tools/nova-ferramenta.html` (HTML auto-contido com CSS e JS inline)
2. Adicione um iframe em `public/index.html`:
   ```html
   <iframe id="frame-nova" src="tools/nova-ferramenta.html" ...></iframe>
   ```
3. Adicione o botão na nav inferior de `public/index.html`
4. Copie o arquivo para `extension/tools/` e repita o passo 2–3 em `extension/index.html`
5. Rode `node build-extension.js` para extrair os scripts e regenerar o `.xpi`

---

## Licença

MIT © 2026 MJardim Serviços Médicos LTDA — veja [LICENSE](extension/LICENSE) para detalhes.
