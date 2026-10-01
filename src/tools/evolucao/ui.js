// UI management for evolucao tool
import {
  state,
  updateInput,
  preencherEstabilidade,
  limparFormulario,
  copyResult,
  atualizarOpcoesDiurese
} from './state.js';
import { renderFeedback } from '../../styles/feedback.js';

// DOM elements cache
const elements = {};

// Initialize UI: bind events and populate form
function init() {
  renderFeedback('Evolução Clínica');
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
