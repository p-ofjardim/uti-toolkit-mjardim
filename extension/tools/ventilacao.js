/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */


// Exporta todas as funções de cálculo para ventilação

// Ventilação
import { calculateVE, formatVEResult } from './volume-minuto.js';
import { calculateIE, formatIEResult } from './ie-ratio.js';
import { calculateCompliance, formatComplianceResult } from './compliance.js';
import { calculateResistance, formatResistanceResult } from './resistance.js';
import { calculateDrivingPressure, formatDrivingPressureResult } from './driving-pressure.js';
import { calculateVolumePesoIdeal, formatVolumePesoIdealResult } from './volume-peso-ideal.js';

// Peso
import { calculatePesoIdealHomem, formatPesoIdealHomemResult } from './peso-ideal-homem.js';
import { calculatePesoIdealMulher, formatPesoIdealMulherResult } from './peso-ideal-mulher.js';

// Gasometria
import { calculatePF, formatPFResult } from './pf-ratio.js';
import { calculatePaCO2Esperado, formatPaCO2EsperadoResult } from './paco2-esperado.js';
import { calculateHCO3Esperado, formatHCO3EsperadoResult } from './hco3-esperado.js';

// Ajustes
import { calculateAjusteFR, formatAjusteFRResult } from './ajuste-fr.js';
import { calculateAjusteVT, formatAjusteVTResult } from './ajuste-vt.js';
import { calculateAjusteVE, formatAjusteVEResult } from './ajuste-ve.js';

// Desmame
import { calculateVTEspontaneo, formatVTEspontaneoResult } from './vt-espontaneo.js';
import { calculateVEEspontaneo, formatVEEspontaneoResult } from './ve-espontaneo.js';
import { calculateRSBI, formatRSBIResult } from './rsbi.js';
import { calculateCROP, formatCROPResult } from './crop-index.js';

// Re-exporta todas as funções
export {
  // Ventilação
  calculateVE, formatVEResult,
  calculateIE, formatIEResult,
  calculateCompliance, formatComplianceResult,
  calculateResistance, formatResistanceResult,
  calculateDrivingPressure, formatDrivingPressureResult,
  calculateVolumePesoIdeal, formatVolumePesoIdealResult,
  
  // Peso
  calculatePesoIdealHomem, formatPesoIdealHomemResult,
  calculatePesoIdealMulher, formatPesoIdealMulherResult,
  
  // Gasometria
  calculatePF, formatPFResult,
  calculatePaCO2Esperado, formatPaCO2EsperadoResult,
  calculateHCO3Esperado, formatHCO3EsperadoResult,
  
  // Ajustes
  calculateAjusteFR, formatAjusteFRResult,
  calculateAjusteVT, formatAjusteVTResult,
  calculateAjusteVE, formatAjusteVEResult,
  
  // Desmame
  calculateVTEspontaneo, formatVTEspontaneoResult,
  calculateVEEspontaneo, formatVEEspontaneoResult,
  calculateRSBI, formatRSBIResult,
  calculateCROP, formatCROPResult
};


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


/**
 * Manipulação de DOM e eventos para a calculadora de ventilação mecânica
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */

import { state, updateInput, openTab } from './state.js';
import * as calculations from './calculations/index.js';

// Função para copiar resultado
function copyResult(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const text = element.textContent || element.innerText;
    navigator.clipboard.writeText(text.replace(/[^0-9.,-]/g, ''));
  }
}

// Função para atualizar o DOM
function updateDOM() {
  // Atualiza inputs
  for (const [id, value] of Object.entries(state.inputs)) {
    const element = document.getElementById(id);
    if (element && element.type !== 'checkbox') {
      element.value = value;
    } else if (element && element.type === 'checkbox') {
      element.checked = value;
    }
  }

  // Atualiza tabs
  document.querySelectorAll('.tab-button').forEach(button => {
    const tabName = button.getAttribute('data-tab');
    if (tabName === state.activeTab) {
      button.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    } else {
      button.classList.remove('active');
      document.getElementById(tabName).classList.remove('active');
    }
  });

  // Atualiza outputs
  updateOutput('ve-result', calculations.formatVEResult(state.outputs.ve));
  updateOutput('ie-result', calculations.formatIEResult(state.outputs.ie));
  updateOutput('c-result', calculations.formatComplianceResult(state.outputs.compliance));
  updateOutput('r-result', calculations.formatResistanceResult(state.outputs.resistance));
  updateOutput('dp-result', calculations.formatDrivingPressureResult(state.outputs.drivingPressure));
  updateOutput('vtpi-result', calculations.formatVolumePesoIdealResult(state.outputs.volumePesoIdeal));
  updateOutput('pih-result', calculations.formatPesoIdealHomemResult(state.outputs.pesoIdealHomem));
  updateOutput('pim-result', calculations.formatPesoIdealMulherResult(state.outputs.pesoIdealMulher));
  updateOutput('pf-result', calculations.formatPFResult(state.outputs.pf));
  updateOutput('paco2e-result', calculations.formatPaCO2EsperadoResult(state.outputs.paco2Esperado));
  updateOutput('hco3e-result', calculations.formatHCO3EsperadoResult(state.outputs.hco3Esperado));
  updateOutput('afr-result', calculations.formatAjusteFRResult(state.outputs.ajusteFR));
  updateOutput('avt-result', calculations.formatAjusteVTResult(state.outputs.ajusteVT));
  updateOutput('ave-result', calculations.formatAjusteVEResult(state.outputs.ajusteVE));
  updateOutput('vtesp-result', calculations.formatVTEspontaneoResult(state.outputs.vtEspontaneo));
  updateOutput('veesp-result', calculations.formatVEEspontaneoResult(state.outputs.veEspontaneo));
  updateOutput('rsbi-result', calculations.formatRSBIResult(state.outputs.rsbi));
  updateOutput('crop-result', calculations.formatCROPResult(state.outputs.crop));

  // Atualiza checklist
  const checklistResult = document.getElementById('checklist-result');
  if (checklistResult) {
    if (state.outputs.checklist === 'ok') {
      checklistResult.className = 'checklist-result ok';
      checklistResult.textContent = '✅ Todos os critérios de desmame estão atendidos!';
    } else if (state.outputs.checklist === 'not-ok') {
      checklistResult.className = 'checklist-result not-ok';
      checklistResult.textContent = '❌ Alguns critérios de desmame não estão atendidos';
    }
  }
}

// Função para atualizar um output específico
function updateOutput(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = content;
  }
}

// Funções de cálculo (chamadas por data-action)
function calcVE() {
  updateInput('ve-vt', parseFloat(document.getElementById('ve-vt').value) || '');
  updateInput('ve-fr', parseFloat(document.getElementById('ve-fr').value) || '');
  updateDOM();
}

function calcIE() {
  updateInput('ie-tinsp', parseFloat(document.getElementById('ie-tinsp').value) || '');
  updateInput('ie-fr', parseFloat(document.getElementById('ie-fr').value) || '');
  updateDOM();
}

function calcComplacencia() {
  updateInput('c-vt', parseFloat(document.getElementById('c-vt').value) || '');
  updateInput('c-pplat', parseFloat(document.getElementById('c-pplat').value) || '');
  updateInput('c-peep', parseFloat(document.getElementById('c-peep').value) || 0);
  updateDOM();
}

function calcResistencia() {
  updateInput('r-ppeak', parseFloat(document.getElementById('r-ppeak').value) || '');
  updateInput('r-pplat', parseFloat(document.getElementById('r-pplat').value) || '');
  updateInput('r-fluxo', parseFloat(document.getElementById('r-fluxo').value) || 0);
  updateDOM();
}

function calcDrivingPressure() {
  updateInput('dp-pplat', parseFloat(document.getElementById('dp-pplat').value) || '');
  updateInput('dp-peep', parseFloat(document.getElementById('dp-peep').value) || 0);
  updateDOM();
}

function calcVolumePesoIdeal() {
  updateInput('vtpi-pi', parseFloat(document.getElementById('vtpi-pi').value) || '');
  updateDOM();
}

function calcPesoIdealHomem() {
  updateInput('pih-altura', parseFloat(document.getElementById('pih-altura').value) || '');
  updateDOM();
}

function calcPesoIdealMulher() {
  updateInput('pim-altura', parseFloat(document.getElementById('pim-altura').value) || '');
  updateDOM();
}

function calcPF() {
  updateInput('pf-pao2', parseFloat(document.getElementById('pf-pao2').value) || '');
  updateInput('pf-fio2', parseFloat(document.getElementById('pf-fio2').value) || 0);
  updateDOM();
}

function calcPaCO2Esperado() {
  updateInput('paco2e-hco3', parseFloat(document.getElementById('paco2e-hco3').value) || '');
  updateDOM();
}

function calcHCO3Esperado() {
  updateInput('hco3e-delta', parseFloat(document.getElementById('hco3e-delta').value) || '');
  updateDOM();
}

function calcAjusteFR() {
  updateInput('afr-fr', parseFloat(document.getElementById('afr-fr').value) || '');
  updateInput('afr-paco2', parseFloat(document.getElementById('afr-paco2').value) || '');
  updateInput('afr-paco2d', parseFloat(document.getElementById('afr-paco2d').value) || 0);
  updateDOM();
}

function calcAjusteVT() {
  updateInput('avt-vt', parseFloat(document.getElementById('avt-vt').value) || '');
  updateInput('avt-paco2d', parseFloat(document.getElementById('avt-paco2d').value) || 0);
  updateInput('avt-paco2', parseFloat(document.getElementById('avt-paco2').value) || '');
  updateDOM();
}

function calcAjusteVE() {
  updateInput('ave-ve', parseFloat(document.getElementById('ave-ve').value) || '');
  updateInput('ave-paco2', parseFloat(document.getElementById('ave-paco2').value) || '');
  updateInput('ave-paco2d', parseFloat(document.getElementById('ave-paco2d').value) || 0);
  updateDOM();
}

function calcVTEsp() {
  updateInput('vtesp-ve', parseFloat(document.getElementById('vtesp-ve').value) || '');
  updateInput('vtesp-fr', parseFloat(document.getElementById('vtesp-fr').value) || '');
  updateDOM();
}

function calcVEEsp() {
  updateInput('veesp-vt', parseFloat(document.getElementById('veesp-vt').value) || '');
  updateInput('veesp-fr', parseFloat(document.getElementById('veesp-fr').value) || '');
  updateDOM();
}

function calcRSBI() {
  updateInput('rsbi-fr', parseFloat(document.getElementById('rsbi-fr').value) || '');
  updateInput('rsbi-vt', parseFloat(document.getElementById('rsbi-vt').value) || '');
  updateDOM();
}

function calcCROP() {
  updateInput('crop-cdin', parseFloat(document.getElementById('crop-cdin').value) || '');
  updateInput('crop-pimax', parseFloat(document.getElementById('crop-pimax').value) || '');
  updateInput('crop-pao2', parseFloat(document.getElementById('crop-pao2').value) || '');
  updateInput('crop-paco2', parseFloat(document.getElementById('crop-paco2').value) || '');
  updateInput('crop-fr', parseFloat(document.getElementById('crop-fr').value) || '');
  updateDOM();
}

function calcChecklist() {
  updateInput('check-rsbi', document.getElementById('check-rsbi').checked);
  updateInput('check-pf', document.getElementById('check-pf').checked);
  updateInput('check-paco2', document.getElementById('check-paco2').checked);
  updateInput('check-ph', document.getElementById('check-ph').checked);
  updateInput('check-hemodinamica', document.getElementById('check-hemodinamica').checked);
  updateInput('check-neurologico', document.getElementById('check-neurologico').checked);
  updateDOM();
}

// Mapeamento de ações para event delegation
export const actions = {
  openTab,
  calcVE,
  calcIE,
  calcComplacencia,
  calcResistencia,
  calcDrivingPressure,
  calcVolumePesoIdeal,
  calcPesoIdealHomem,
  calcPesoIdealMulher,
  calcPF,
  calcPaCO2Esperado,
  calcHCO3Esperado,
  calcAjusteFR,
  calcAjusteVT,
  calcAjusteVE,
  calcVTEsp,
  calcVEEsp,
  calcRSBI,
  calcCROP,
  calcChecklist,
  copyResult
};

// Inicializa o DOM
document.addEventListener('DOMContentLoaded', () => {
  // Configura event delegation para todos os botões com data-action
  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.getAttribute('data-action');
    if (actions[action]) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        actions[action](e);
      });
    }
  });

  // Configura event delegation para tabs
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = button.getAttribute('data-tab');
      openTab(tabName);
      updateDOM();
    });
  });

  // Atualiza inputs ao digitarem
  document.querySelectorAll('input[type="number"], input[type="text"], select').forEach(input => {
    input.addEventListener('input', () => {
      const id = input.id;
      if (id) {
        if (input.type === 'checkbox') {
          updateInput(id, input.checked);
        } else {
          updateInput(id, input.value);
        }
      }
    });
  });

  // Inicializa o DOM
  updateDOM();
});



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
