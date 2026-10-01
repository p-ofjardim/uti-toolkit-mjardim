/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */

var __mod_tbw_percentage_0 = (function () {
/**
 * Calcula a porcentagem de TBW (Total Body Water) com base em idade e sexo
 * @param {number} age - Idade em anos
 * @param {string} gender - Sexo ('male' ou 'female')
 * @returns {number} Porcentagem de TBW (0.45 a 0.6)
 */
function calculateTBWPercentage(age, gender) {
  if (age >= 65) {
    // Idoso
    return gender === 'male' ? 0.5 : 0.45;
  } else {
    // Adulto
    return gender === 'male' ? 0.6 : 0.5;
  }
}
return { calculateTBWPercentage: calculateTBWPercentage };
})();

var __mod_water_deficit_1 = (function () {
/**
 * Calcula o déficit de água livre usando a fórmula de Adrogue-Madias (NEJM 2000)
 * @param {number} sodium - Sódio sérico atual (mEq/L)
 * @param {number} desiredSodium - Sódio desejado (mEq/L)
 * @param {number} weight - Peso do paciente (kg)
 * @param {number} tbwPercentage - Porcentagem de TBW (Total Body Water)
 * @returns {number} Déficit de água livre em litros
 */
function calculateWaterDeficit(sodium, desiredSodium, weight, tbwPercentage) {
  // Fórmula: Déficit (L) = %TBW × Peso × (Na_atual / Na_desejado - 1)
  return tbwPercentage * weight * (sodium / desiredSodium - 1);
}
return { calculateWaterDeficit: calculateWaterDeficit };
})();

var __mod_correction_rate_2 = (function () {
/**
 * Calcula a taxa de correção máxima recomendada (8-10 mEq/L em 24h)
 * @param {number} currentDifference - Diferença atual entre sódio e alvo (mEq/L)
 * @returns {number} Taxa de correção máxima (mEq/L)
 */
function calculateMaxCorrectionRate(currentDifference) {
  const MAX_CORRECTION = 10; // 10 mEq/L em 24h
  return Math.min(MAX_CORRECTION, Math.abs(currentDifference));
}

/**
 * Calcula a porcentagem de correção recomendada
 * @param {number} currentDifference - Diferença atual entre sódio e alvo (mEq/L)
 * @returns {number} Porcentagem de correção (0-100)
 */
function calculateCorrectionPercentage(currentDifference) {
  const maxCorrection = calculateMaxCorrectionRate(currentDifference);
  return Math.min((maxCorrection / Math.abs(currentDifference)) * 100, 100);
}
return { calculateMaxCorrectionRate: calculateMaxCorrectionRate, calculateCorrectionPercentage: calculateCorrectionPercentage };
})();

var __mod_index_3 = (function (__reexport_calculateTBWPercentage, __reexport_calculateWaterDeficit, __reexport_calculateMaxCorrectionRate, __reexport_calculateCorrectionPercentage) {
// Exporta todas as funções de cálculo para águia livre
return { calculateTBWPercentage: __reexport_calculateTBWPercentage, calculateWaterDeficit: __reexport_calculateWaterDeficit, calculateMaxCorrectionRate: __reexport_calculateMaxCorrectionRate, calculateCorrectionPercentage: __reexport_calculateCorrectionPercentage };
})(__mod_tbw_percentage_0.calculateTBWPercentage, __mod_water_deficit_1.calculateWaterDeficit, __mod_correction_rate_2.calculateMaxCorrectionRate, __mod_correction_rate_2.calculateCorrectionPercentage);

var __mod_state_4 = (function (calculations) {
/**
 * Gerenciador de estado para a calculadora de água livre
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */



// Estado inicial
const state = {
  inputs: {
    sodium: 140,          // Sódio sérico atual (mEq/L)
    desiredSodium: 140,   // Sódio desejado (mEq/L)
    weight: 70,           // Peso (kg)
    age: 40,              // Idade (anos)
    gender: 'male',       // Sexo ('male' ou 'female')
  },
  outputs: {
    tbwPercentage: null,      // %TBW (Total Body Water)
    waterDeficitLiters: null, // Déficit de água livre (L)
    waterDeficitML: null,     // Déficit de água livre (mL)
    maxCorrectionRate: null, // Taxa de correção máxima (mEq/L)
    correctionPercentage: null, // Porcentagem de correção recomendada
  },
  // Dependências: quais outputs dependem de quais inputs
  dependencies: {
    tbwPercentage: ['age', 'gender'],
    waterDeficitLiters: ['sodium', 'desiredSodium', 'weight', 'tbwPercentage'],
    waterDeficitML: ['waterDeficitLiters'],
    maxCorrectionRate: ['sodium', 'desiredSodium'],
    correctionPercentage: ['sodium', 'desiredSodium'],
  },
};

/**
 * Atualiza um input e recalcula todas as dependências
 * @param {string} name - Nome do input
 * @param {number|string} value - Valor do input
 */
function updateInput(name, value) {
  // Atualiza o input
  state.inputs[name] = value;
  
  // Recalcula todos os outputs
  recalculate();
}

/**
 * Recalcula todos os outputs com base nos inputs atuais
 */
function recalculate() {
  // Calcula %TBW
  state.outputs.tbwPercentage = calculations.calculateTBWPercentage(
    state.inputs.age,
    state.inputs.gender
  );

  // Calcula déficit de água livre (em litros)
  state.outputs.waterDeficitLiters = calculations.calculateWaterDeficit(
    state.inputs.sodium,
    state.inputs.desiredSodium,
    state.inputs.weight,
    state.outputs.tbwPercentage
  );

  // Converte para mL
  state.outputs.waterDeficitML = state.outputs.waterDeficitLiters * 1000;

  // Calcula taxa de correção máxima
  const currentDifference = state.inputs.sodium - state.inputs.desiredSodium;
  state.outputs.maxCorrectionRate = calculations.calculateMaxCorrectionRate(currentDifference);
  state.outputs.correctionPercentage = calculations.calculateCorrectionPercentage(currentDifference);
}

// Inicializa o estado
recalculate();

// Exporta o estado e funções
return { updateInput: updateInput, state: state };
})(__mod_index_3);

var __mod_feedback_5 = (function () {
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
    '<p>Esta estimativa parece errada? Avise-nos — não é preciso saber programar.</p>' +
    '<a class="feedback-link feedback-issue" href="' + issueUrl + '" target="_blank" rel="noopener">Reportar problema (GitHub)</a>' +
    '<a class="feedback-link feedback-mail" href="' + mailto + '">Reportar por e-mail</a>' +
    '<a class="feedback-link feedback-discussion" href="' + DISCUSSIONS_URL + '" target="_blank" rel="noopener">Tirar dúvida nas Discussions</a>';

  container.appendChild(box);
}
return { renderFeedback: renderFeedback, collectInputs: collectInputs, buildFeedbackBody: buildFeedbackBody, truncateBody: truncateBody, ISSUE_URL: ISSUE_URL, DISCUSSIONS_URL: DISCUSSIONS_URL, CONTACT_EMAIL: CONTACT_EMAIL };
})();

var __mod_ui_6 = (function (state, updateInput, renderFeedback) {
/**
 * Manipulação de DOM e eventos para a calculadora de água livre
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */




// Elementos do DOM
const form = document.getElementById('waterDeficitForm');
const resultDiv = document.getElementById('result');
const deficitValueElement = document.getElementById('deficitValue');
const deficitDescriptionElement = document.getElementById('deficitDescription');
const waterVolumeElement = document.getElementById('waterVolume');
const waterVolumeRow = waterVolumeElement.closest('p');
const correctionRateElement = document.getElementById('correctionRate');

/**
 * Atualiza o DOM com os valores do estado
 */
function updateDOM() {
  // Atualiza inputs (para refletir mudanças programáticas)
  document.getElementById('sodium').value = state.inputs.sodium;
  document.getElementById('desiredSodium').value = state.inputs.desiredSodium;
  document.getElementById('weight').value = state.inputs.weight;
  document.getElementById('age').value = state.inputs.age;
  document.getElementById('gender').value = state.inputs.gender;

  // Atualiza outputs
  if (state.outputs.waterDeficitLiters !== null) {
    const roundedDeficitL = Math.round(state.outputs.waterDeficitLiters * 100) / 100;
    const roundedDeficitML = Math.round(state.outputs.waterDeficitML * 100) / 100;
    deficitValueElement.textContent = `${roundedDeficitL} L (${roundedDeficitML} mL)`;

    // Determina a descrição com base no resultado
    let descriptionText = '';
    let volumeText = '';
    let correctionText = '';

    if (state.inputs.sodium < state.inputs.desiredSodium) {
      // Hiponatremia: resultado negativo (possível sobrecarga hídrica)
      descriptionText = `Excesso de água livre: <strong>Hiponatremia (Na⁺ ${state.inputs.sodium} < ${state.inputs.desiredSodium})</strong>`;
      waterVolumeRow.style.display = 'none';
      volumeText = ``;
      correctionText = `⚠️ Correção máxima recomendada: até ${state.outputs.maxCorrectionRate} mEq/L nas primeiras 24 horas (${state.outputs.correctionPercentage.toFixed(1)}% do déficit total).`;
    } else if (state.inputs.sodium > state.inputs.desiredSodium) {
      // Hipernatremia: déficit positivo (precisa adicionar água)
      descriptionText = `Déficit de água livre: <strong>Hipernatremia (Na⁺ ${state.inputs.sodium} > ${state.inputs.desiredSodium})</strong>`;
      waterVolumeRow.style.display = 'block';
      volumeText = `${Math.abs(roundedDeficitML)} mL de água livre a ser reposta (Solução glicosada 5%)`;
      correctionText = `⚠️ Correção máxima recomendada: reduzir até ${state.outputs.maxCorrectionRate} mEq/L nas primeiras 24 horas (${state.outputs.correctionPercentage.toFixed(1)}% do excesso total).`;
    } else {
      descriptionText = `Sódio dentro do alvo (Na⁺ = ${state.inputs.sodium} mEq/L)`;
      volumeText = `Nenhum déficit`;
      correctionText = ``;
    }

    deficitDescriptionElement.innerHTML = descriptionText;
    waterVolumeElement.textContent = volumeText;
    correctionRateElement.innerHTML = correctionText;

    // Mostra o resultado
    resultDiv.style.display = 'block';
  }
}

/**
 * Função para limpar o resultado
 */
function clearResult() {
  resultDiv.style.display = 'none';
}

// Evento de submit do formulário
form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Atualiza todos os inputs do formulário
  updateInput('sodium', parseFloat(document.getElementById('sodium').value) || 0);
  updateInput('desiredSodium', parseFloat(document.getElementById('desiredSodium').value) || 0);
  updateInput('weight', parseFloat(document.getElementById('weight').value) || 0);
  updateInput('age', parseInt(document.getElementById('age').value) || 0);
  updateInput('gender', document.getElementById('gender').value);
  
  // Atualiza o DOM
  updateDOM();
  
  // Rola a tela até o resultado
  resultDiv.scrollIntoView({ behavior: 'smooth' });
});

// Adiciona evento para limpar ao clicar nos inputs
const inputs = form.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('focus', clearResult);
});

// Inicializa o DOM
updateDOM();
renderFeedback('Água Livre e Sódio');

})(__mod_state_4.state, __mod_state_4.updateInput, __mod_feedback_5.renderFeedback);