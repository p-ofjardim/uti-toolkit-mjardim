/**
 * Gerenciador de estado para a calculadora de ventilação mecânica
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */

import * as calculations from './calculations/index.js';

// Estado inicial
const state = {
  inputs: {
    // Ventilação
    've-vt': '',
    've-fr': '',
    'ie-tinsp': '',
    'ie-fr': '',
    'c-vt': '',
    'c-pplat': '',
    'c-peep': 5,
    'r-ppeak': '',
    'r-pplat': '',
    'r-fluxo': 1,
    'dp-pplat': '',
    'dp-peep': 5,
    'vtpi-pi': '',
    
    // Peso
    'pih-altura': '',
    'pim-altura': '',
    
    // Gasometria
    'pf-pao2': '',
    'pf-fio2': 0.21,
    'paco2e-hco3': '',
    'hco3e-delta': '',
    
    // Ajustes
    'afr-fr': '',
    'afr-paco2': '',
    'afr-paco2d': 40,
    'avt-vt': '',
    'avt-paco2d': 40,
    'avt-paco2': '',
    'ave-ve': '',
    'ave-paco2': '',
    'ave-paco2d': 40,
    
    // Desmame
    'vtesp-ve': '',
    'vtesp-fr': '',
    'veesp-vt': '',
    'veesp-fr': '',
    'rsbi-fr': '',
    'rsbi-vt': '',
    'crop-cdin': '',
    'crop-pimax': '',
    'crop-pao2': '',
    'crop-paco2': '',
    'crop-fr': '',
    
    // Checklist
    'check-rsbi': false,
    'check-pf': false,
    'check-paco2': false,
    'check-ph': false,
    'check-hemodinamica': false,
    'check-neurologico': false
  },
  outputs: {
    // Ventilação
    ve: null,
    ie: null,
    compliance: null,
    resistance: null,
    drivingPressure: null,
    volumePesoIdeal: null,
    
    // Peso
    pesoIdealHomem: null,
    pesoIdealMulher: null,
    
    // Gasometria
    pf: null,
    paco2Esperado: null,
    hco3Esperado: null,
    
    // Ajustes
    ajusteFR: null,
    ajusteVT: null,
    ajusteVE: null,
    
    // Desmame
    vtEspontaneo: null,
    veEspontaneo: null,
    rsbi: null,
    crop: null,
    
    // Checklist
    checklist: null
  },
  activeTab: 'ventilacao'
};

/**
 * Atualiza um input e recalcula todas as dependências
 * @param {string} name - Nome do input
 * @param {number|string|boolean} value - Valor do input
 */
export function updateInput(name, value) {
  state.inputs[name] = value;
  recalculate();
}

/**
 * Recalcula todos os outputs com base nos inputs atuais
 */
function recalculate() {
  // Ventilação
  state.outputs.ve = calculations.calculateVE(
    parseFloat(state.inputs['ve-vt']) || 0,
    parseFloat(state.inputs['ve-fr']) || 0
  );
  
  state.outputs.ie = calculations.calculateIE(
    parseFloat(state.inputs['ie-tinsp']) || 0,
    parseFloat(state.inputs['ie-fr']) || 0
  );
  
  state.outputs.compliance = calculations.calculateCompliance(
    parseFloat(state.inputs['c-vt']) || 0,
    parseFloat(state.inputs['c-pplat']) || 0,
    parseFloat(state.inputs['c-peep']) || 0
  );
  
  state.outputs.resistance = calculations.calculateResistance(
    parseFloat(state.inputs['r-ppeak']) || 0,
    parseFloat(state.inputs['r-pplat']) || 0,
    parseFloat(state.inputs['r-fluxo']) || 0
  );
  
  state.outputs.drivingPressure = calculations.calculateDrivingPressure(
    parseFloat(state.inputs['dp-pplat']) || 0,
    parseFloat(state.inputs['dp-peep']) || 0
  );
  
  state.outputs.volumePesoIdeal = calculations.calculateVolumePesoIdeal(
    parseFloat(state.inputs['vtpi-pi']) || 0
  );
  
  // Peso
  state.outputs.pesoIdealHomem = calculations.calculatePesoIdealHomem(
    parseFloat(state.inputs['pih-altura']) || 0
  );
  
  state.outputs.pesoIdealMulher = calculations.calculatePesoIdealMulher(
    parseFloat(state.inputs['pim-altura']) || 0
  );
  
  // Gasometria
  state.outputs.pf = calculations.calculatePF(
    parseFloat(state.inputs['pf-pao2']) || 0,
    parseFloat(state.inputs['pf-fio2']) || 0
  );
  
  state.outputs.paco2Esperado = calculations.calculatePaCO2Esperado(
    parseFloat(state.inputs['paco2e-hco3']) || 0
  );
  
  state.outputs.hco3Esperado = calculations.calculateHCO3Esperado(
    parseFloat(state.inputs['hco3e-delta']) || 0
  );
  
  // Ajustes
  state.outputs.ajusteFR = calculations.calculateAjusteFR(
    parseFloat(state.inputs['afr-fr']) || 0,
    parseFloat(state.inputs['afr-paco2']) || 0,
    parseFloat(state.inputs['afr-paco2d']) || 0
  );
  
  state.outputs.ajusteVT = calculations.calculateAjusteVT(
    parseFloat(state.inputs['avt-vt']) || 0,
    parseFloat(state.inputs['avt-paco2d']) || 0,
    parseFloat(state.inputs['avt-paco2']) || 0
  );
  
  state.outputs.ajusteVE = calculations.calculateAjusteVE(
    parseFloat(state.inputs['ave-ve']) || 0,
    parseFloat(state.inputs['ave-paco2']) || 0,
    parseFloat(state.inputs['ave-paco2d']) || 0
  );
  
  // Desmame
  state.outputs.vtEspontaneo = calculations.calculateVTEspontaneo(
    parseFloat(state.inputs['vtesp-ve']) || 0,
    parseFloat(state.inputs['vtesp-fr']) || 0
  );
  
  state.outputs.veEspontaneo = calculations.calculateVEEspontaneo(
    parseFloat(state.inputs['veesp-vt']) || 0,
    parseFloat(state.inputs['veesp-fr']) || 0
  );
  
  state.outputs.rsbi = calculations.calculateRSBI(
    parseFloat(state.inputs['rsbi-fr']) || 0,
    parseFloat(state.inputs['rsbi-vt']) || 0
  );
  
  state.outputs.crop = calculations.calculateCROP(
    parseFloat(state.inputs['crop-cdin']) || 0,
    parseFloat(state.inputs['crop-pimax']) || 0,
    parseFloat(state.inputs['crop-pao2']) || 0,
    parseFloat(state.inputs['crop-paco2']) || 0,
    parseFloat(state.inputs['crop-fr']) || 0
  );
  
  // Checklist
  const checklistItems = [
    state.inputs['check-rsbi'],
    state.inputs['check-pf'],
    state.inputs['check-paco2'],
    state.inputs['check-ph'],
    state.inputs['check-hemodinamica'],
    state.inputs['check-neurologico']
  ];
  const allChecked = checklistItems.every(item => item === true);
  state.outputs.checklist = allChecked ? 'ok' : 'not-ok';
}

/**
 * Abre uma aba
 * @param {string} tabName - Nome da aba
 */
export function openTab(tabName) {
  state.activeTab = tabName;
  updateInput('activeTab', tabName);
}

// Inicializa o estado
recalculate();

// Exporta o estado e funções
export { state, updateInput, openTab };
