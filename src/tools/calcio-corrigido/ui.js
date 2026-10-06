/**
 * Manipulação de DOM e eventos para a calculadora de cálcio corrigido
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */
import { state, updateInput, calcular } from './state.js';
import * as calculations from './calculations/index.js';
import { renderFeedback } from '../../styles/feedback.js';

function updateDOM() {
  for (const [id, value] of Object.entries(state.inputs)) {
    const element = document.getElementById(id);
    if (element) element.value = value;
  }
  const resultDiv = document.getElementById('result');
  document.getElementById('calcio-resultado').innerHTML =
    calculations.formatCalcioCorrigidoResult(
      typeof state.inputs['calcio-total'] === 'number'
        ? state.inputs['calcio-total']
        : parseFloat(state.inputs['calcio-total']),
      typeof state.inputs.albumina === 'number'
        ? state.inputs.albumina
        : parseFloat(state.inputs.albumina)
    );
  resultDiv.style.display = 'block';
}

const actions = {
  calcular: (e) => {
    e.preventDefault();
    document.querySelectorAll('input').forEach((input) => {
      updateInput(input.id, input.value);
    });
    calcular();
    updateDOM();
  },
};

export { actions };

document.addEventListener('DOMContentLoaded', () => {
  renderFeedback('Cálcio corrigido pela albumina');
  document.querySelectorAll('[data-action]').forEach((el) => {
    const action = el.getAttribute('data-action');
    if (actions[action]) {
      el.addEventListener('click', (e) => {
        actions[action](e);
      });
    }
  });
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      updateInput(input.id, input.value);
      calcular();
      updateDOM();
    });
  });
  const form = document.getElementById('calcioForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    actions.calcular(e);
  });
  updateDOM();
});
