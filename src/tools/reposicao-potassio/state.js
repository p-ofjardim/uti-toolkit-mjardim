/**
 * Gerenciador de estado para a calculadora de reposição de potássio
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */
import * as calculations from './calculations/index.js';

const state = {
  inputs: {
    peso: 70,
    potassio: 3.0,
    urgencia: 'nao',
    fosfato: 1.2,
    'potassio-plasma': 3.1,
    'kcl-dia': 0,
  },
  outputs: {
    deficit: null,
    faixa: null,
    gravidade: null,
    fosfato: null,
    sal: null,
    aporteTotal: null,
  },
};

export function updateInput(name, value) {
  state.inputs[name] = value;
}

function toNumber(value) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function calcular() {
  const peso = toNumber(state.inputs.peso);
  const potassio = toNumber(state.inputs.potassio);
  state.outputs.deficit = calculations.calculateDeficitPotassio(potassio, peso);
  state.outputs.faixa = calculations.faixaAlternativa70kg(potassio);
  state.outputs.gravidade = calculations.classifyGravidadeHipocalemia(
    potassio,
    state.inputs.urgencia === 'sim'
  );
}

export function calcularFosfato() {
  const peso = toNumber(state.inputs.peso);
  const fosfato = toNumber(state.inputs.fosfato);
  const potassioPlasma = toNumber(state.inputs['potassio-plasma']);
  const kclDia = toNumber(state.inputs['kcl-dia']);
  state.outputs.fosfato = calculations.calculateFosfatoPotassio(fosfato, peso);
  state.outputs.sal = calculations.selecionarSal(potassioPlasma);
  const kFosfato = state.outputs.fosfato ? state.outputs.fosfato.potassiumMEq : 0;
  state.outputs.aporteTotal = {
    total: (kclDia || 0) + kFosfato,
    limite: calculations.limiteVelocidadePorPeso(peso),
  };
}

calcular();
calcularFosfato();

export { state };
