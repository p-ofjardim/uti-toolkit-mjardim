# UTI Toolkit – MJardim Serviços Médicos

Calculadoras clínicas para UTI, empacotadas como **PWA instalável** (Android e iOS) e **extensão Firefox** (desktop e Android).

---

## Encontrou um problema ou tem uma sugestão? Não é preciso saber programar.

- **Dúvidas de uso e discussões** (linguagem livre, sem formato):
  [GitHub Discussions](https://github.com/p-ofjardim/uti-toolkit-mjardim/discussions)
- **Reportar um cálculo/dose que parece errado ou sugerir nova ferramenta**
  (formulário guiado): [Issues](https://github.com/p-ofjardim/uti-toolkit-mjardim/issues/new/choose)
- **Dentro do app**: cada tela tem o aviso *"Esta estimativa parece errada? Avise-nos"*
  e o menu principal tem *"Reportar problema / Sugerir melhoria"*.

Contribuições clínicas (revisão de fórmulas, doses, redação e testes de instalação)
são as mais valiosas — veja [CONTRIBUTING.md](CONTRIBUTING.md),
seção *"Como contribuir sem saber programar"*.

Quer acompanhar apenas as novidades? Use **Watch → Custom → Releases** para receber
somente os lançamentos, com notas legíveis (novas calculadoras, correções clínicas).

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

## Nova Arquitetura (Unix Philosophy)

O projeto foi refatorado para seguir os princípios Unix: **ferramentas pequenas, focadas e composáveis**.

### Estrutura de Diretórios

```
.
├── src/                          # Fonte único de verdade (Single Source of Truth)
│   └── tools/
│       ├── <ferramenta>/
│       │   ├── index.html          # Markup puro (sem JS/CSS inline)
│       │   ├── style.css           # Estilos separados
│       │   ├── calculations/       # Cálculos modularizados (1 arquivo por função)
│       │   │   ├── <calc1>.js
│       │   │   ├── <calc2>.js
│       │   │   └── index.js         # Exporta todos os cálculos
│       │   ├── state.js            # Gerenciamento de estado centralizado
│       │   └── ui.js               # Manipulação DOM + event delegation
│
├── public/                       # PWA (gerado automaticamente pelo build)
├── docs/                         # GitHub Pages (gerado pelo build:pwa, com caminhos reescritos para /uti-toolkit-mjardim/)
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   └── tools/                    # HTML auto-contido (CSS/JS inline)
│
├── extension/                    # Extensão Firefox (gerado automaticamente)
│   ├── manifest.json
│   ├── background.js
│   ├── index.html
│   ├── app.js
│   └── tools/                    # Arquivos para MV2 (CSS/JS externos)
│
├── scripts/
│   ├── build-pwa.js             # Gera PWA a partir de src/
│   └── build-extension.js        # Gera extensão Firefox a partir de src/
│
├── test/                      # Vazio; testes vivem em __tests__/ junto aos cálculos
│
├── package.json
└── README.md
```

### Princípios da Nova Arquitetura

1. **Single Source of Truth**: Todo código está em `src/`, eliminando duplicação entre PWA e extensão
2. **Cálculos Modularizados**: Cada função de cálculo está em um arquivo separado (Unix: "do one thing well")
3. **Funções Puras**: Todos os cálculos são pure functions (sem acesso ao DOM, sem side effects)
4. **Event Delegation**: Compatível com Firefox MV2 CSP (sem `onclick` inline)
5. **Data Attributes**: Usa `data-field` e `data-action` para event delegation
6. **Build Automatizado**: Scripts Node.js geram ambos os formatos (PWA e extensão)

### Fluxo de Dados

```
Input (DOM) → state.js (updateInput) → recalculate() → state.outputs → ui.js (syncResult)
```

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

### Instalar dependências

```bash
npm install
```

### Rodar localmente (PWA)

```bash
npm run dev
# ou
node server.js
# Acesse http://localhost:5000
```

### Gerar builds

```bash
# Gera PWA e extensão
npm run build

# Apenas PWA
npm run build:pwa

# Apenas extensão Firefox
npm run build:extension
```

### Rodar testes

```bash
npm test              # Roda todos os testes uma vez
npm run test:watch   # Roda testes em modo watch (auto-reload)
```

### Adicionar uma nova ferramenta

1. Crie a estrutura em `src/tools/nova-ferramenta/`:
   ```
   nova-ferramenta/
   ├── index.html
   ├── style.css
   ├── calculations/
   │   ├── calc1.js
   │   ├── calc2.js
   │   └── index.js
   ├── state.js
   └── ui.js
   ```

2. Adicione o iframe em `public/index.html`:
   ```html
   <iframe id="frame-nova" src="tools/nova-ferramenta.html" ...></iframe>
   ```

3. Adicione o botão na nav inferior de `public/index.html`

4. Execute `npm run build` para gerar os arquivos de saída

---

## Estrutura de uma Ferramenta

### Exemplo: água-livre

```
src/tools/agua-livre/
├── index.html          # Markup com data-field e data-action
├── style.css           # Estilos CSS
├── calculations/
│   ├── tbw-percentage.js    # Cálculo de % TBW
│   ├── water-deficit.js      # Cálculo de déficit de água
│   ├── correction-rate.js    # Taxa de correção
│   └── index.js              # Exporta todos os cálculos
├── state.js            # Estado centralizado
└── ui.js               # Event delegation
```

### calculations/calc.js (Exemplo)

```javascript
/**
 * Calcula a porcentagem de TBW
 * @param {number} age - Idade em anos
 * @param {string} gender - Sexo ('male' ou 'female')
 * @returns {number} Porcentagem de TBW (0.45 a 0.6)
 */
export function calculateTBWPercentage(age, gender) {
  if (age >= 65) {
    return gender === 'male' ? 0.5 : 0.45;
  }
  return gender === 'male' ? 0.6 : 0.5;
}
```

### state.js (Estrutura)

```javascript
import { calculateTBWPercentage } from './calculations/index.js';

const state = {
  inputs: { peso: '', sodio: '', idade: '', sexo: 'M' },
  outputs: { tbw: null, deficit: null, resultadoText: '' }
};

function updateInput(field, value) {
  state.inputs[field] = value;
  recalculate();
}

function recalculate() {
  state.outputs.tbw = calculateTBWPercentage(
    state.inputs.idade, 
    state.inputs.sexo
  );
  // ... outros cálculos
}

export { state, updateInput };
```

### ui.js (Estrutura)

```javascript
import { state, updateInput } from './state.js';

function init() {
  // Bind inputs
  document.querySelectorAll('[data-field]').forEach(el => {
    const field = el.getAttribute('data-field');
    el.addEventListener('input', () => {
      updateInput(field, el.value);
    });
  });

  // Bind actions
  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.getAttribute('data-action');
    el.addEventListener('click', actions[action]);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

---

## Testes Automatizados

Todos os cálculos são testados automaticamente:

```bash
npm test
```

### Exemplo de teste

```javascript
// src/tools/agua-livre/calculations/__tests__/tbw-percentage.test.js
import { test } from 'node:test';
import { strictEqual } from 'node:assert/strict';
import { calculateTBWPercentage } from '../tbw-percentage.js';

test('adult male should return 0.6', () => {
  strictEqual(calculateTBWPercentage(30, 'male'), 0.6);
});

test('elderly female (65+) should return 0.45', () => {
  strictEqual(calculateTBWPercentage(70, 'female'), 0.45);
});
```

---

## Licença

MIT © 2026 MJardim Serviços Médicos LTDA — veja [LICENSE](extension/LICENSE) para detalhes.
