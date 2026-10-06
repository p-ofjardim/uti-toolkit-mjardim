/**
 * Gerenciador de estado para a calculadora de cálcio corrigido
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */
import * as calculations from './calculations/index.js';

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

export function calcular() {
  const calcioTotal = toNumber(state.inputs['calcio-total']);
  const albumina = toNumber(state.inputs.albumina);
  state.outputs.calcioCorrigido = calculations.calculateCalcioCorrigido(calcioTotal, albumina);
  state.outputs.classificacao = calculations.classifyCalcioCorrigido(state.outputs.calcioCorrigido);
}

export function updateInput(name, value) {
  state.inputs[name] = value;
}

calcular();

export { state };
