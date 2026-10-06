/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */

var __mod_calcio_corrigido_0 = (function () {
/**
 * Cálcio sérico corrigido pela albumina.
 *
 * Ca corrigido (mg/dL) = Ca total (mg/dL) + 0,8 × (4,0 − albumina em g/dL)
 *
 * Classificação: < 8,0 mg/dL hipocalcemia; 8,0–10,5 normal;
 * > 11,0 hipercalcemia (limiar do INCA para hipercalcemia).
 *
 * Aviso clínico: os fatores de correção pela albumina não são confiáveis
 * para diagnóstico de hipo/hipercalcemia em pacientes críticos; o único
 * método confiável é o cálcio iônico com eletrodos ion-seletivos
 * (Slomp, Crit Care Med 2003; Byrnes, Am J Surg 2005; The ICU Book,
 * cap. Cálcio e Fósforo).
 */
function calculateCalcioCorrigido(calcioTotal, albumina) {
  if (
    typeof calcioTotal !== 'number' || !Number.isFinite(calcioTotal) || calcioTotal < 0 ||
    typeof albumina !== 'number' || !Number.isFinite(albumina) || albumina < 0
  ) {
    return null;
  }
  return calcioTotal + 0.8 * (4.0 - albumina);
}

function classifyCalcioCorrigido(calcioCorrigido) {
  if (typeof calcioCorrigido !== 'number' || !Number.isFinite(calcioCorrigido)) {
    return null;
  }
  if (calcioCorrigido < 8.0) {
    return {
      rotulo: 'Hipocalcemia (cálcio corrigido < 8,0 mg/dL)',
      classificacao: 'hipocalcemia',
    };
  }
  if (calcioCorrigido > 11.0) {
    return {
      rotulo: 'Hipercalcemia (cálcio corrigido > 11,0 mg/dL)',
      classificacao: 'hipercalcemia',
    };
  }
  return {
    rotulo: 'Cálcio corrigido dentro da faixa usual (8,0–11,0 mg/dL)',
    classificacao: 'normal',
  };
}

function formatCalcioCorrigidoResult(calcioTotal, albumina) {
  const corrigido = calculateCalcioCorrigido(calcioTotal, albumina);
  if (corrigido === null) {
    return 'Informe cálcio total (mg/dL) e albumina (g/dL) válidos.';
  }
  const rounded = Math.round(corrigido * 100) / 100;
  const classification = classifyCalcioCorrigido(corrigido);
  return `Cálcio corrigido: <strong>${rounded.toFixed(2).replace('.', ',')} mg/dL</strong> — ${classification.rotulo}.`;
}
return { calculateCalcioCorrigido: calculateCalcioCorrigido, classifyCalcioCorrigido: classifyCalcioCorrigido, formatCalcioCorrigidoResult: formatCalcioCorrigidoResult };
})();

var __mod_index_1 = (function (calculateCalcioCorrigido, classifyCalcioCorrigido, formatCalcioCorrigidoResult) {
// Exporta todas as funções de cálculo de cálcio corrigido
return { calculateCalcioCorrigido: calculateCalcioCorrigido, classifyCalcioCorrigido: classifyCalcioCorrigido, formatCalcioCorrigidoResult: formatCalcioCorrigidoResult };
})(__mod_calcio_corrigido_0.calculateCalcioCorrigido, __mod_calcio_corrigido_0.classifyCalcioCorrigido, __mod_calcio_corrigido_0.formatCalcioCorrigidoResult);

var __mod_state_2 = (function (calculations) {
/**
 * Gerenciador de estado para a calculadora de cálcio corrigido
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */


const state = {
  inputs: {
    'calcio-total': 7.5,
    albumina: 2.5,
  },
  outputs: {
    calcioCorrigido: null,
    classificacao: null,
  },
};

function toNumber(value) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function calcular() {
  const calcioTotal = toNumber(state.inputs['calcio-total']);
  const albumina = toNumber(state.inputs.albumina);
  state.outputs.calcioCorrigido = calculations.calculateCalcioCorrigido(calcioTotal, albumina);
  state.outputs.classificacao = calculations.classifyCalcioCorrigido(state.outputs.calcioCorrigido);
}

function updateInput(name, value) {
  state.inputs[name] = value;
}

calcular();
return { calcular: calcular, updateInput: updateInput, state: state };
})(__mod_index_1);

var __mod_feedback_3 = (function () {
/**
 * Módulo de feedback clínico compartilhado
 * Renderiza um link de feedback no fim de cada ferramenta,
 * com contexto pré-preenchido (valores de entrada), sem exigir conta GitHub.
 */

var ISSUE_URL = 'https://github.com/p-ofjardim/uti-toolkit-mjardim/issues/new?template=bug-report.yml';
var DISCUSSIONS_URL = 'https://github.com/p-ofjardim/uti-toolkit-mjardim/discussions';
var CONTACT_EMAIL = 'p-ofjardim@users.noreply.github.com';
var BODY_MAX_CHARS = 2000;

function collectInputs() {
  var inputs = document.querySelectorAll('input, select');
  var lines = [];
  inputs.forEach(function (el) {
    var label = null;
    if (el.id) {
      var labelEl = document.querySelector('label[for="' + el.id + '"]');
      if (labelEl) label = labelEl.textContent.trim();
    }
    if (!label) label = el.name || el.id || 'campo';
    var value = el.type === 'checkbox' || el.type === 'radio' ? (el.checked ? el.value : '') : el.value;
    if (value === '' || value == null) return;
    lines.push('- ' + label + ': ' + value);
  });
  return lines.join('\n');
}

function buildFeedbackBody(toolName) {
  var lines = [
    'Ferramenta: ' + toolName,
    '',
    'Valores usados:',
    collectInputs(),
    '',
    'O que eu esperava:',
    '',
    'O que apareceu:',
  ];
  return lines.join('\n');
}

function truncateBody(text) {
  if (text.length <= BODY_MAX_CHARS) return text;
  return text.slice(0, BODY_MAX_CHARS) + '\n(…texto truncado por limite de tamanho)';
}

function renderFeedback(toolName) {
  var container = document.querySelector('.container');
  if (!container || document.getElementById('clinical-feedback')) return;

  var body = encodeURIComponent(truncateBody(buildFeedbackBody(toolName)));
  var issueUrl = ISSUE_URL + '&title=' + encodeURIComponent('[' + toolName + '] Resultado parece errado') +
    '&body=' + body;
  var mailto = 'mailto:' + CONTACT_EMAIL +
    '?subject=' + encodeURIComponent('Feedback UTI Toolkit – ' + toolName) +
    '&body=' + body;

  var box = document.createElement('div');
  box.id = 'clinical-feedback';
  box.className = 'feedback-box';
  box.innerHTML =
    '<p>Esta estimativa parece errada? Avise-nos.</p>' +
    '<a class="feedback-link feedback-issue" href="' + issueUrl + '" target="_blank" rel="noopener">Reportar problema (GitHub)</a>' +
    '<a class="feedback-link feedback-mail" href="' + mailto + '">Reportar por e-mail</a>' +
    '<a class="feedback-link feedback-discussion" href="' + DISCUSSIONS_URL + '" target="_blank" rel="noopener">Tirar dúvida nas Discussions</a>';

  container.appendChild(box);
}
return { renderFeedback: renderFeedback, collectInputs: collectInputs, buildFeedbackBody: buildFeedbackBody, truncateBody: truncateBody, ISSUE_URL: ISSUE_URL, DISCUSSIONS_URL: DISCUSSIONS_URL, CONTACT_EMAIL: CONTACT_EMAIL };
})();

var __mod_ui_4 = (function (state, updateInput, calcular, calculations, renderFeedback) {
/**
 * Manipulação de DOM e eventos para a calculadora de cálcio corrigido
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */




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
return { actions: actions };
})(__mod_state_2.state, __mod_state_2.updateInput, __mod_state_2.calcular, __mod_index_1, __mod_feedback_3.renderFeedback);