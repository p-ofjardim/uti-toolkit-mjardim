/**
 * Gerenciador de estado para a ferramenta de distúrbios hidroeletrolíticos
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */
import * as calculations from './calculations/index.js';

const state = {
  activeTab: 'potassio',
  inputs: {
    // Potássio
    'k-peso': 70,
    'k-potassio': 3.0,
    'k-urgencia': 'nao',
    // Fosfato
    'f-fosfato': 1.2,
    'f-peso': 70,
    'f-potassio-plasma': 3.1,
    'f-kcl-dia': 0,
    // Sódio
    's-sodio': 140,
    's-sodio-alvo': 140,
    's-peso': 70,
    's-idade': 40,
    's-sexo': 'male',
    // Cálcio
    'c-calcio-total': 7.5,
    'c-albumina': 2.5,
  },
  outputs: {
    deficit: null,
    faixa: null,
    gravidade: null,
    fosfato: null,
    sal: null,
    aporteTotal: null,
    agua: null,
    calcioCorrigido: null,
  },
};

function toNumber(value) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function updateInput(name, value) {
  state.inputs[name] = value;
}

export function calcularPotassio() {
  const peso = toNumber(state.inputs['k-peso']);
  const potassio = toNumber(state.inputs['k-potassio']);
  state.outputs.deficit = calculations.calculateDeficitPotassio(potassio, peso);
  state.outputs.faixa = calculations.faixaAlternativa70kg(potassio);
  state.outputs.gravidade = calculations.classifyGravidadeHipocalemia(
    potassio,
    state.inputs['k-urgencia'] === 'sim'
  );
}

export function calcularFosfato() {
  const peso = toNumber(state.inputs['f-peso']);
  const fosfato = toNumber(state.inputs['f-fosfato']);
  const potassioPlasma = toNumber(state.inputs['f-potassio-plasma']);
  const kclDia = toNumber(state.inputs['f-kcl-dia']);
  state.outputs.fosfato = calculations.calculateFosfatoPotassio(fosfato, peso);
  state.outputs.sal = calculations.selecionarSal(potassioPlasma);
  const kFosfato = state.outputs.fosfato ? state.outputs.fosfato.potassiumMEq : 0;
  state.outputs.aporteTotal = {
    total: (kclDia || 0) + kFosfato,
    limite: calculations.limiteVelocidadePorPeso(peso),
  };
}

export function calcularSodio() {
  const sodio = toNumber(state.inputs['s-sodio']);
  const alvo = toNumber(state.inputs['s-sodio-alvo']);
  const peso = toNumber(state.inputs['s-peso']);
  const idade = toNumber(state.inputs['s-idade']);
  const sexo = state.inputs['s-sexo'];
  if (sodio === null || alvo === null || peso === null || !alvo) {
    state.outputs.agua = null;
    return;
  }
  const tbw = calculations.calculateTBWPercentage(idade || 0, sexo);
  const deficitLiters = calculations.calculateWaterDeficit(sodio, alvo, peso, tbw);
  const difference = sodio - alvo;
  state.outputs.agua = {
    deficitLiters,
    deficitML: deficitLiters * 1000,
    hipernatremia: difference > 0,
    maxCorrectionRate: calculations.calculateMaxCorrectionRate(difference),
    correctionPercentage: calculations.calculateCorrectionPercentage(difference),
    sodio,
    alvo,
  };
}

export function calcularCalcio() {
  const calcioTotal = toNumber(state.inputs['c-calcio-total']);
  const albumina = toNumber(state.inputs['c-albumina']);
  state.outputs.calcioCorrigido = calculations.calculateCalcioCorrigido(calcioTotal, albumina);
}

export function openTab(tabName) {
  state.activeTab = tabName;
}

calcularPotassio();
calcularFosfato();
calcularSodio();
calcularCalcio();

export { state };
