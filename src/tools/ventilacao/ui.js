/**
 * Manipulação de DOM e eventos para a calculadora de ventilação mecânica
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */

import { state, updateInput, openTab } from './state.js';
import * as calculations from './calculations/index.js';
import { renderFeedback } from '../../styles/feedback.js';

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
  renderFeedback('Ventilação Mecânica');
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
