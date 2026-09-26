/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */


// Exporta todas as funções de cálculo para RSI

export { calculateEtomidate } from './etomidate.js';
export { calculateKetamine } from './ketamine.js';
export { calculatePropofol } from './propofol.js';
export { calculateMidazolam } from './midazolam.js';
export { calculateMethohexital } from './methohexital.js';
export { calculateThiopental } from './thiopental.js';
export { calculateSuccinylcholine } from './succinylcholine.js';
export { calculateRocuronium } from './rocuronium.js';
export { calculateVecuronium } from './vecuronium.js';


/**
 * Gerenciador de estado para a calculadora RSI
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */

import * as calculations from './calculations/index.js';

// Estado inicial
const state = {
  inputs: {
    peso: 70,
    activeTab: 'inducao',
    // Indução
    'etomidate-conc': 2,
    'ketamine-dose': 1,
    'ketamine-conc': 10,
    'propofol-dose': 1,
    'propofol-conc': 10,
    'midazolam-dose': 0.1,
    'midazolam-conc': 1,
    'methohexital-conc': 10,
    'thiopental-dose': 3,
    'thiopental-conc': 25,
    // Bloqueadores
    'succinylcholine-conc': 20,
    'rocuronium-dose': 0.6,
    'rocuronium-conc': 10,
    'vecuronium-dose': 0.1,
    'vecuronium-conc': 10
  },
  outputs: {
    // Indução
    etomidate: null,
    ketamine: null,
    propofol: null,
    midazolam: null,
    methohexital: null,
    thiopental: null,
    // Bloqueadores
    succinylcholine: null,
    rocuronium: null,
    vecuronium: null,
    // Resultado
    resultadoText: ''
  }
};

/**
 * Atualiza um input e recalcula todas as dependências
 * @param {string} name - Nome do input
 * @param {number|string} value - Valor do input
 */
export function updateInput(name, value) {
  state.inputs[name] = value;
  recalculate();
}

/**
 * Recalcula todos os outputs com base nos inputs atuais
 */
function recalculate() {
  const peso = state.inputs.peso || 0;
  
  if (peso <= 0) {
    state.outputs.resultadoText = 'Informe o peso do paciente.';
    return;
  }
  
  // Indução
  state.outputs.etomidate = calculations.calculateEtomidate(peso, state.inputs['etomidate-conc']);
  state.outputs.ketamine = calculations.calculateKetamine(peso, state.inputs['ketamine-dose'], state.inputs['ketamine-conc']);
  state.outputs.propofol = calculations.calculatePropofol(peso, state.inputs['propofol-dose'], state.inputs['propofol-conc']);
  state.outputs.midazolam = calculations.calculateMidazolam(peso, state.inputs['midazolam-dose'], state.inputs['midazolam-conc']);
  state.outputs.methohexital = calculations.calculateMethohexital(peso, state.inputs['methohexital-conc']);
  state.outputs.thiopental = calculations.calculateThiopental(peso, state.inputs['thiopental-dose'], state.inputs['thiopental-conc']);
  
  // Bloqueadores
  state.outputs.succinylcholine = calculations.calculateSuccinylcholine(peso, state.inputs['succinylcholine-conc']);
  state.outputs.rocuronium = calculations.calculateRocuronium(peso, state.inputs['rocuronium-dose'], state.inputs['rocuronium-conc']);
  state.outputs.vecuronium = calculations.calculateVecuronium(peso, state.inputs['vecuronium-dose'], state.inputs['vecuronium-conc']);
  
  // Gera texto de resultado
  generateResultadoText();
}

/**
 * Gera o texto de resultado
 */
function generateResultadoText() {
  const peso = state.inputs.peso || 0;
  let texto = `Cálculo para paciente de ${peso} kg:\n\n`;
  
  if (state.inputs.activeTab === 'inducao') {
    texto += "=== AGENTES DE INDUÇÃO ===\n";
    texto += `• Etomidato: ${state.outputs.etomidate.doseTotal.toFixed(1)} mg (${state.outputs.etomidate.volume.toFixed(1)} mL de solução a ${state.inputs['etomidate-conc']} mg/mL)\n`;
    texto += `• Cetamina: ${state.outputs.ketamine.doseTotal.toFixed(1)} mg (${state.outputs.ketamine.volume.toFixed(1)} mL de solução a ${state.inputs['ketamine-conc']} mg/mL)\n`;
    texto += `• Propofol: ${state.outputs.propofol.doseTotal.toFixed(1)} mg (${state.outputs.propofol.volume.toFixed(1)} mL de solução a ${state.inputs['propofol-conc']} mg/mL)\n`;
    texto += `• Midazolam: ${state.outputs.midazolam.doseTotal.toFixed(1)} mg (${state.outputs.midazolam.volume.toFixed(1)} mL de solução a ${state.inputs['midazolam-conc']} mg/mL)\n`;
    texto += `• Metohexital: ${state.outputs.methohexital.doseTotal.toFixed(1)} mg (${state.outputs.methohexital.volume.toFixed(1)} mL de solução a ${state.inputs['methohexital-conc']} mg/mL)\n`;
    texto += `• Tiopental: ${state.outputs.thiopental.doseTotal.toFixed(1)} mg (${state.outputs.thiopental.volume.toFixed(1)} mL de solução a ${state.inputs['thiopental-conc']} mg/mL)\n`;
  } else {
    texto += "=== BLOQUEADORES NEUROMUSCULARES ===\n";
    texto += `• Succinilcolina: ${state.outputs.succinylcholine.doseTotal.toFixed(1)} mg (${state.outputs.succinylcholine.volume.toFixed(1)} mL de solução a ${state.inputs['succinylcholine-conc']} mg/mL)\n`;
    texto += `• Rocurônio: ${state.outputs.rocuronium.doseTotal.toFixed(1)} mg (${state.outputs.rocuronium.volume.toFixed(1)} mL de solução a ${state.inputs['rocuronium-conc']} mg/mL)\n`;
    texto += `• Vecurônio: ${state.outputs.vecuronium.doseTotal.toFixed(1)} mg (${state.outputs.vecuronium.volume.toFixed(1)} mL de solução a ${state.inputs['vecuronium-conc']} mg/mL)\n`;
  }
  
  texto += "\n⚠️  Verifique sempre a concentração do frasco antes da administração!";
  state.outputs.resultadoText = texto;
}

/**
 * Mostra uma aba
 * @param {string} tabName - Nome da aba
 */
export function showTab(tabName) {
  state.inputs.activeTab = tabName;
  updateInput('activeTab', tabName);
}

/**
 * Copia o resultado para a área de transferência
 */
export function copyResult() {
  if (!state.outputs.resultadoText || state.outputs.resultadoText.trim() === '') {
    alert('Nenhum texto para copiar');
    return;
  }
  navigator.clipboard.writeText(state.outputs.resultadoText).then(() => {
    alert('Texto copiado para a área de transferência!');
  }).catch(err => {
    alert('Erro ao copiar: ' + err);
  });
}

// Inicializa o estado
recalculate();

// Exporta o estado e funções
export { state, updateInput, showTab, copyResult };


/**
 * Manipulação de DOM e eventos para a calculadora RSI
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */

import { state, updateInput, showTab, copyResult } from './state.js';

// Função para atualizar o DOM
function updateDOM() {
  // Atualiza peso
  const pesoInput = document.getElementById('peso');
  if (pesoInput) {
    pesoInput.value = state.inputs.peso;
  }

  // Atualiza tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Ativa a aba ativa
  const activeTabButton = Array.from(document.querySelectorAll('.tab')).find(
    tab => tab.textContent.includes(state.inputs.activeTab === 'inducao' ? 'Indução' : 'Bloqueadores')
  );
  if (activeTabButton) {
    activeTabButton.classList.add('active');
  }
  
  const activeTabContent = document.getElementById(state.inputs.activeTab);
  if (activeTabContent) {
    activeTabContent.classList.add('active');
  }

  // Atualiza campos de dose
  const fields = [
    'etomidate-conc', 'ketamine-dose', 'ketamine-conc', 'propofol-dose', 'propofol-conc',
    'midazolam-dose', 'midazolam-conc', 'methohexital-conc', 'thiopental-dose', 'thiopental-conc',
    'succinylcholine-conc', 'rocuronium-dose', 'rocuronium-conc', 'vecuronium-dose', 'vecuronium-conc'
  ];
  
  fields.forEach(field => {
    const element = document.getElementById(field);
    if (element) {
      element.value = state.inputs[field];
    }
  });

  // Atualiza resultados
  if (state.outputs.etomidate) {
    document.getElementById('etomidate-result').value = 
      `${state.outputs.etomidate.doseTotal.toFixed(1)} mg (${state.outputs.etomidate.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.ketamine) {
    document.getElementById('ketamine-result').value = 
      `${state.outputs.ketamine.doseTotal.toFixed(1)} mg (${state.outputs.ketamine.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.propofol) {
    document.getElementById('propofol-result').value = 
      `${state.outputs.propofol.doseTotal.toFixed(1)} mg (${state.outputs.propofol.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.midazolam) {
    document.getElementById('midazolam-result').value = 
      `${state.outputs.midazolam.doseTotal.toFixed(1)} mg (${state.outputs.midazolam.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.methohexital) {
    document.getElementById('methohexital-result').value = 
      `${state.outputs.methohexital.doseTotal.toFixed(1)} mg (${state.outputs.methohexital.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.thiopental) {
    document.getElementById('thiopental-result').value = 
      `${state.outputs.thiopental.doseTotal.toFixed(1)} mg (${state.outputs.thiopental.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.succinylcholine) {
    document.getElementById('succinylcholine-result').value = 
      `${state.outputs.succinylcholine.doseTotal.toFixed(1)} mg (${state.outputs.succinylcholine.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.rocuronium) {
    document.getElementById('rocuronium-result').value = 
      `${state.outputs.rocuronium.doseTotal.toFixed(1)} mg (${state.outputs.rocuronium.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.vecuronium) {
    document.getElementById('vecuronium-result').value = 
      `${state.outputs.vecuronium.doseTotal.toFixed(1)} mg (${state.outputs.vecuronium.volume.toFixed(1)} mL)`;
  }

  // Atualiza resultado
  const resultadoInput = document.getElementById('resultado');
  if (resultadoInput) {
    resultadoInput.value = state.outputs.resultadoText;
  }
}

// Mapeamento de ações para event delegation
export const actions = {
  showTab,
  copyResult
};

// Inicializa o DOM
document.addEventListener('DOMContentLoaded', () => {
  // Configura event delegation para todos os elementos com data-action
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
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = tab.getAttribute('data-tab');
      showTab(tabName);
      updateDOM();
    });
  });

  // Atualiza inputs ao digitarem ou mudarem
  document.querySelectorAll('input, select').forEach(input => {
    const id = input.id;
    if (id) {
      input.addEventListener('input', () => {
        updateInput(id, input.value);
      });
      input.addEventListener('change', () => {
        updateInput(id, input.value);
      });
    }
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
