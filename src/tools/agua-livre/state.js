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
