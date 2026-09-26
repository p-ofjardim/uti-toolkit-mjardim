/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */


// Central export for all evolucao calculations

export { preencherEstabilidade } from './preencher-estabilidade.js';
export { limparFormulario } from './limpar-formulario.js';
export { atualizarOpcoesDiurese } from './atualizar-opcoes-diurese.js';
export { ajustarGenero } from './ajustar-genero.js';
export { processarHemodinamica } from './processar-hemodinamica.js';
export { processarVentilacao } from './processar-ventilacao.js';
export { processarNeuro } from './processar-neuro.js';
export { processarInfecto } from './processar-infecto.js';
export { processarRenal } from './processar-renal.js';
export { processarHematologico } from './processar-hematologico.js';
export { processarMetabolico } from './processar-metabolico.js';
export { processarNutricao } from './processar-nutricao.js';
export { processarLesoesPele } from './processar-lesoes-pele.js';
export { processarInvasoes } from './processar-invasoes.js';
export { processarProfilaxia } from './processar-profilaxia.js';
export { gerarEvolucao } from './gerar-evolucao.js';


// Central state management for evolucao tool
import {
  preencherEstabilidade,
  limparFormulario,
  ajustarGenero,
  gerarEvolucao
} from './calculations/index.js';

// Define all input fields
const inputFields = [
  'box', 'data', 'sexo',
  'nora', 'vaso', 'dobuta', 'tridil', 'nipride',
  'ventilac', 'ventilac-valor', 'vm', 'adapt',
  'neuro', 'rass', 'sedacao',
  'atb', 'febre', 'infecto',
  'diurese', 'diuretico', 'bh', 'esc-renal',
  'hemato', 'hemoterapia',
  'glicemias', 'dhes', 'bic',
  'dieta', 'dieta-valor', 'disf-tgi', 'evacuac',
  'cvc', 'cdl', 'pia', 'svd', 'les-pele', 'profilax'
];

// State object
const state = {
  inputs: {},
  outputs: {
    resultadoText: ''
  }
};

// Initialize state with default values
function initializeState() {
  inputFields.forEach(field => {
    state.inputs[field] = '';
  });
  // Set default values
  state.inputs.box = '11';
  state.inputs.sexo = 'M';
  state.inputs.data = new Date().toISOString().split('T')[0];
}

// Update an input field and trigger recalculation
function updateInput(field, value) {
  if (inputFields.includes(field)) {
    state.inputs[field] = value;
    recalculate();
  }
}

// Recalculate all outputs based on current inputs
function recalculate() {
  const inputs = { ...state.inputs };
  
  // Generate the evolution text
  const rawText = gerarEvolucao(inputs);
  
  // Adjust gender
  const finalText = ajustarGenero(rawText, inputs.sexo);
  
  state.outputs.resultadoText = finalText;
}

// Fill form with stability defaults
function fillEstabilidade() {
  const defaults = preencherEstabilidade();
  Object.entries(defaults).forEach(([field, value]) => {
    if (inputFields.includes(field)) {
      state.inputs[field] = value;
    }
  });
  recalculate();
}

// Clear form
function clearFormulario() {
  const cleared = limparFormulario();
  Object.entries(cleared).forEach(([field, value]) => {
    if (inputFields.includes(field)) {
      state.inputs[field] = value;
    }
  });
  recalculate();
}

// Copy result to clipboard
async function copyResult() {
  const text = state.outputs.resultadoText;
  if (!text || text.trim() === '') {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error copying:', err);
    return false;
  }
}

// Update diurese options based on gender
function updateDiureseOptions(sexo) {
  // This will be handled by UI
  state.inputs.sexo = sexo;
  recalculate();
}

// Get current state
function getState() {
  return {
    inputs: { ...state.inputs },
    outputs: { ...state.outputs }
  };
}

// Initialize
initializeState();

// Export everything
export {
  state,
  updateInput,
  recalculate,
  fillEstabilidade as preencherEstabilidade,
  clearFormulario as limparFormulario,
  copyResult,
  updateDiureseOptions as atualizarOpcoesDiurese,
  getState
};


// UI management for evolucao tool
import {
  state,
  updateInput,
  preencherEstabilidade,
  limparFormulario,
  copyResult,
  atualizarOpcoesDiurese
} from './state.js';

// DOM elements cache
const elements = {};

// Initialize UI: bind events and populate form
function init() {
  // Cache all elements with data-field or data-action
  document.querySelectorAll('[data-field]').forEach(el => {
    const field = el.getAttribute('data-field');
    elements[field] = el;
    
    // Set initial value from state
    if (state.inputs[field] !== undefined) {
      el.value = state.inputs[field];
    }
    
    // Bind input change
    el.addEventListener('input', () => {
      updateInput(field, el.value);
    });
    
    // Special handling for date field
    if (field === 'data' && !el.value) {
      el.value = new Date().toISOString().split('T')[0];
      updateInput(field, el.value);
    }
  });

  // Cache result textarea
  const resultadoEl = document.getElementById('resultado');
  if (resultadoEl) {
    elements.resultado = resultadoEl;
  }

  // Bind action buttons
  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.getAttribute('data-action');
    
    switch (action) {
      case 'preencherEstabilidade':
        el.addEventListener('click', () => {
          preencherEstabilidade();
          syncForm();
        });
        break;
      case 'limparFormulario':
        el.addEventListener('click', () => {
          limparFormulario();
          syncForm();
        });
        break;
      case 'gerarEvolucao':
        el.addEventListener('click', () => {
          // Already handled by state recalculation on input changes
          // But we can force a recalc if needed
          syncResult();
        });
        break;
      case 'copyResult':
        el.addEventListener('click', async () => {
          const success = await copyResult();
          if (success) {
            alert('Texto copiado para a área de transferência!');
          } else {
            alert('Erro ao copiar ou nenhum texto para copiar');
          }
        });
        break;
    }
  });

  // Bind gender change to update diurese options
  const sexoEl = document.getElementById('sexo');
  if (sexoEl) {
    sexoEl.addEventListener('change', () => {
      const sexo = sexoEl.value;
      updateInput('sexo', sexo);
      atualizarOpcoesDiurese(sexo);
      updateDiureseSelect(sexo);
    });
  }

  // Initial sync
  syncForm();
  syncResult();

  // Setup observer for state changes
  setupStateObserver();
}

// Sync form fields with state
function syncForm() {
  Object.entries(state.inputs).forEach(([field, value]) => {
    const el = elements[field];
    if (el && el.value !== value) {
      el.value = value;
    }
  });
}

// Sync result textarea with state
function syncResult() {
  const resultadoEl = elements.resultado;
  if (resultadoEl && resultadoEl.value !== state.outputs.resultadoText) {
    resultadoEl.value = state.outputs.resultadoText;
  }
}

// Update diurese select options based on gender
function updateDiureseSelect(sexo) {
  const isFem = sexo === 'F';
  const select = document.getElementById('diurese');
  if (!select) return;

  const pares = [
    ['Oligúrico', 'Oligúrica'],
    ['Anúrico', 'Anúrica']
  ];

  const currentVal = select.value;
  pares.forEach(([masc, fem]) => {
    const opt = Array.from(select.options).find(o => o.value === masc || o.value === fem);
    if (!opt) return;
    const novo = isFem ? fem : masc;
    opt.value = novo;
    opt.text = novo;
    if (currentVal === masc || currentVal === fem) select.value = novo;
  });
}

// Setup observer for state changes
function setupStateObserver() {
  // Simple polling for state changes (since we can't use Proxy in all environments)
  setInterval(() => {
    syncResult();
  }, 100);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { init, syncForm, syncResult, updateDiureseSelect };



// Firefox MV2 event delegation (replaces inline onclick)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-fn]').forEach(function (el) {
    var fn = el.getAttribute('data-fn');
    var arg = el.getAttribute('data-arg');
    el.addEventListener('click', function (e) {
      if (typeof window[fn] === 'function') {
        arg !== null ? window[fn](e, arg) : window[fn]();
      }
    });
  });

  // Adicional: suporte para data-action (usado em ui.js)
  document.querySelectorAll('[data-action]').forEach(function (el) {
    var action = el.getAttribute('data-action');
    el.addEventListener('click', function (e) {
      if (typeof window[action] === 'function') {
        window[action](e);
      }
    });
  });
});
