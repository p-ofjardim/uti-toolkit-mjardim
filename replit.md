# UTI Toolkit – MJardim Serviços Médicos

Aplicativo PWA (Progressive Web App) com calculadoras e ferramentas clínicas para UTI.
Instalável em Android e iPhone diretamente pelo navegador.

## Stack

- **Frontend:** HTML/CSS/JS puro (sem frameworks)
- **Server:** Node.js built-in `http` (sem dependências externas)
- **PWA:** Web App Manifest + Service Worker (cache offline)

## Como executar

```bash
node server.js
```

Acessa em `http://localhost:5000`.

## Estrutura

```
public/
  index.html          ← Shell do app (header + bottom nav + iframes)
  manifest.json       ← PWA manifest
  sw.js               ← Service Worker (cache offline)
  icons/              ← Ícones SVG do app
  tools/
    ventilacao.html   ← Calculadora de Ventilação Mecânica
    rsi.html          ← Calculadora de Doses RSI / Intubação
    infusao.html      ← Calculadora de Infusão de Medicamentos UTI
    agua-livre.html   ← Calculadora de Déficit de Água Livre
    evolucao.html     ← Gerador de Evolução Clínica
server.js             ← Servidor HTTP estático
```

## Ferramentas incluídas

| Ferramenta | Ícone | Descrição |
|---|---|---|
| Ventilação Mecânica | 🫁 | VE, I:E, complacência, resistência, driving pressure, RSBI, CROP, desmame |
| Doses RSI | 💉 | Agentes de indução + bloqueadores neuromusculares por kg |
| Infusão UTI | 💊 | Cálculo de taxa de infusão para aminas, sedação, BNM, vasodilatadores |
| Sódio / Água Livre | 💧 | Déficit de água livre (fórmula NEJM Adrogue & Madias) |
| Evolução Clínica | 📋 | Gerador de texto de evolução estruturada por sistemas |

## Instalação como app no celular

- **Android:** Chrome → menu "⋮" → "Adicionar à tela inicial"
- **iPhone:** Safari → botão Compartilhar → "Adicionar à Tela de Início"

O banner de instalação aparece automaticamente no Android.

## Correções aplicadas

- **Bug I:E ratio corrigido** (Ventilação Mecânica): a fórmula estava invertida (`Tinsp/Texp`); corrigida para `Texp/Tinsp`, exibida como `1:X`.

## Adicionar novas ferramentas

1. Criar `public/tools/nova-ferramenta.html` com a calculadora
2. Adicionar `<iframe>` em `public/index.html` (copiar padrão existente)
3. Adicionar botão `<button>` no `<nav class="bottom-nav">` com `data-frame="nova-ferramenta"`
4. Adicionar o arquivo ao array `ASSETS` em `public/sw.js`

## User preferences

- Idioma do app: Português Brasileiro
- Crédito: MJardim Serviços Médicos (visível no header do app e no nome PWA)
