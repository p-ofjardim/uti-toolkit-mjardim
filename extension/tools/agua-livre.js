/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */


// Exporta todas as funções de cálculo para águia livre
export { calculateTBWPercentage } from './tbw-percentage.js';
export { calculateWaterDeficit } from './water-deficit.js';
export { calculateMaxCorrectionRate, calculateCorrectionPercentage } from './correction-rate.js';


/**
 * Gerenciador de estado para a calculadora de água livre
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */

import * as calculations from './calculations/index.js';

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
export function updateInput(name, value) {
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
export { state, updateInput };


/**
 * Manipulação de DOM e eventos para a calculadora de água livre
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */

import { state, updateInput } from './state.js';

// Elementos do DOM
const form = document.getElementById('waterDeficitForm');
const resultDiv = document.getElementById('result');
const deficitValueElement = document.getElementById('deficitValue');
const deficitDescriptionElement = document.getElementById('deficitDescription');
const waterVolumeElement = document.getElementById('waterVolume');
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
      // Hiponatremia: déficit negativo (precisa remover água)
      descriptionText = `Excesso de água livre: <strong>Hiponatremia (Na⁺ ${state.inputs.sodium} < ${state.inputs.desiredSodium})</strong>`;
      volumeText = `${Math.abs(roundedDeficitML)} mL de água livre`;
      correctionText = `⚠️ Correção máxima recomendada: até ${state.outputs.maxCorrectionRate} mEq/L nas primeiras 24 horas (${state.outputs.correctionPercentage.toFixed(1)}% do déficit total).`;
    } else if (state.inputs.sodium > state.inputs.desiredSodium) {
      // Hipernatremia: déficit positivo (precisa adicionar água)
      descriptionText = `Déficit de água livre: <strong>Hipernatremia (Na⁺ ${state.inputs.sodium} > ${state.inputs.desiredSodium})</strong>`;
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
