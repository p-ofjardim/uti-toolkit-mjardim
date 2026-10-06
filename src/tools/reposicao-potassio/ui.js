/**
 * Manipulação de DOM e eventos para a calculadora de reposição de potássio
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */
import { state, updateInput, calcular, calcularFosfato } from './state.js';
import * as calculations from './calculations/index.js';
import { renderFeedback } from '../../styles/feedback.js';

function updateDOM() {
  for (const [id, value] of Object.entries(state.inputs)) {
    const element = document.getElementById(id);
    if (element) element.value = value;
  }
  document.getElementById('deficit-result').innerHTML =
    calculations.formatDeficitPotassioResult(state.outputs.deficit);
  const faixa = state.outputs.faixa;
  document.getElementById('faixa-result').textContent = faixa
    ? `Faixa alternativa de estimativa (adulto de 70 kg): ${faixa.min}–${faixa.max} mEq.`
    : '';
  document.getElementById('gravidade-result').innerHTML =
    calculations.formatGravidadeResult(state.outputs.gravidade);
  document.getElementById('limites-result').textContent =
    calculations.formatLimitesSeguranca(parseFloat(state.inputs.peso));
  document.getElementById('fosfato-result').innerHTML =
    calculations.formatFosfatoResult(state.outputs.fosfato);
  const sal = state.outputs.sal;
  document.getElementById('sal-result').textContent = sal
    ? `Sal selecionado para K plasmático informado: ${sal} (fosfato de potássio se K < 4 mEq/L; fosfato de sódio se K ≥ 4 mEq/L).`
    : 'Informe o K plasmático para selecionar o sal.';
  const aporte = state.outputs.aporteTotal;
  document.getElementById('aporte-result').textContent = aporte
    ? `Aporte total de K do dia (KCl + K do fosfato): ${Math.round(aporte.total)} mEq. Limite de velocidade periférico ajustado ao peso: ${aporte.limite ? aporte.limite.toFixed(0) : '?'} mEq/h.`
    : '';
}

const actions = {
  calcular: () => {
    calcular();
    updateDOM();
  },
  calcularFosfato: () => {
    calcularFosfato();
    updateDOM();
  },
};

export { actions };

document.addEventListener('DOMContentLoaded', () => {
  renderFeedback('Reposição de potássio e fosfato');
  document.querySelectorAll('[data-action]').forEach((el) => {
    const action = el.getAttribute('data-action');
    if (actions[action]) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        actions[action](e);
      });
    }
  });
  document.querySelectorAll('input, select').forEach((input) => {
    const id = input.id;
    if (id) {
      input.addEventListener('input', () => {
        updateInput(id, input.value);
        calcular();
        calcularFosfato();
        updateDOM();
      });
      input.addEventListener('change', () => {
        updateInput(id, input.value);
        calcular();
        calcularFosfato();
        updateDOM();
      });
    }
  });
  updateDOM();
});
