/**
 * Manipulação de DOM e eventos para a ferramenta de distúrbios hidroeletrolíticos
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */
import {
  state,
  updateInput,
  openTab,
  calcularPotassio,
  calcularFosfato,
  calcularSodio,
  calcularCalcio,
} from './state.js';
import * as calculations from './calculations/index.js';
import { renderFeedback } from '../../styles/feedback.js';

function toNumber(value) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function updateDOM() {
  for (const [id, value] of Object.entries(state.inputs)) {
    const element = document.getElementById(id);
    if (element) element.value = value;
  }

  document.querySelectorAll('.tab-button').forEach((button) => {
    const tabName = button.getAttribute('data-tab');
    if (tabName === state.activeTab) {
      button.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    } else {
      button.classList.remove('active');
      document.getElementById(tabName).classList.remove('active');
    }
  });

  // Potássio
  document.getElementById('k-deficit-result').innerHTML =
    calculations.formatDeficitPotassioResult(state.outputs.deficit);
  const faixa = state.outputs.faixa;
  document.getElementById('k-faixa-result').textContent = faixa
    ? `Faixa alternativa de estimativa (adulto de 70 kg): ${faixa.min}–${faixa.max} mEq.`
    : '';
  document.getElementById('k-gravidade-result').innerHTML =
    calculations.formatGravidadeResult(state.outputs.gravidade);
  document.getElementById('k-limites-result').textContent =
    calculations.formatLimitesSeguranca(toNumber(state.inputs['k-peso']));

  // Fosfato
  document.getElementById('f-fosfato-result').innerHTML =
    calculations.formatFosfatoResult(state.outputs.fosfato);
  const sal = state.outputs.sal;
  document.getElementById('f-sal-result').textContent = sal
    ? `Sal selecionado para o K plasmático informado: ${sal} (fosfato de potássio se K < 4 mEq/L; fosfato de sódio se K ≥ 4 mEq/L).`
    : 'Informe o K plasmático para selecionar o sal.';
  const aporte = state.outputs.aporteTotal;
  document.getElementById('f-aporte-result').textContent = aporte
    ? `Aporte total de K do dia (KCl + K do fosfato): ${Math.round(aporte.total)} mEq. Limite de velocidade periférico ajustado ao peso: ${aporte.limite ? aporte.limite.toFixed(0) : '?'} mEq/h.`
    : '';

  // Sódio
  const agua = state.outputs.agua;
  const sResult = document.getElementById('s-result');
  if (!agua) {
    sResult.innerHTML = 'Informe sódio atual, alvo e peso válidos.';
  } else {
    const litros = Math.round(agua.deficitLiters * 100) / 100;
    const mL = Math.round(agua.deficitML);
    if (agua.hipernatremia) {
      sResult.innerHTML =
        `Déficit de água livre: <strong>${litros} L (${mL} mL)</strong> (hipernatremia — Na⁺ ${agua.sodio} > ${agua.alvo}). ` +
        `Volume a repor: ${Math.abs(mL)} mL de água livre (solução glicosada 5%). ⚠️ Correção máxima: reduzir até ${agua.maxCorrectionRate} mEq/L nas primeiras 24 h (${agua.correctionPercentage.toFixed(1)}% do excesso total).`;
    } else if (agua.sodio < agua.alvo) {
      sResult.innerHTML =
        `Excesso de água livre: <strong>hiponatremia (Na⁺ ${agua.sodio} < ${agua.alvo})</strong>. ` +
        `⚠️ Correção máxima: até ${agua.maxCorrectionRate} mEq/L nas primeiras 24 h (${agua.correctionPercentage.toFixed(1)}% do déficit total).`;
    } else {
      sResult.innerHTML = `Sódio dentro do alvo (Na⁺ = ${agua.sodio} mEq/L). Nenhum déficit.`;
    }
  }

  // Cálcio
  document.getElementById('c-result').innerHTML =
    calculations.formatCalcioCorrigidoResult(
      toNumber(state.inputs['c-calcio-total']),
      toNumber(state.inputs['c-albumina'])
    );
}

const actions = {
  openTab: (e) => {
    openTab(e.currentTarget.getAttribute('data-tab'));
    updateDOM();
  },
  calcularPotassio: () => {
    calcularPotassio();
    updateDOM();
  },
  calcularFosfato: () => {
    calcularFosfato();
    updateDOM();
  },
  calcularSodio: () => {
    calcularSodio();
    updateDOM();
  },
  calcularCalcio: () => {
    calcularCalcio();
    updateDOM();
  },
};

export { actions };

document.addEventListener('DOMContentLoaded', () => {
  renderFeedback('Distúrbios hidroeletrolíticos');
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
      const recalc = () => {
        updateInput(id, input.value);
        calcularPotassio();
        calcularFosfato();
        calcularSodio();
        calcularCalcio();
        updateDOM();
      };
      input.addEventListener('input', recalc);
      input.addEventListener('change', recalc);
    }
  });
  updateDOM();
});
