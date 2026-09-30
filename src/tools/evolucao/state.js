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
