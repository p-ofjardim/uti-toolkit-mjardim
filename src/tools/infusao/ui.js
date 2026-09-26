/**
 * Manipulação de DOM e eventos para a calculadora de infusão
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */

import { state, updateInput, copyResult, clearResult } from './state.js';
import { getMedicamento } from './calculations/index.js';

// Função para atualizar o DOM
function updateDOM() {
  // Atualiza medicamento
  const medicamentoSelect = document.getElementById('medicamento');
  if (medicamentoSelect) {
    medicamentoSelect.value = state.inputs.medicamento;
  }

  // Atualiza dose
  const doseInput = document.getElementById('dose');
  if (doseInput) {
    doseInput.value = state.inputs.dose;
  }

  // Atualiza unidade dose
  const unidadeDoseSelect = document.getElementById('unidadeDose');
  if (unidadeDoseSelect) {
    unidadeDoseSelect.value = state.inputs.unidadeDose;
  }

  // Atualiza peso
  const pesoInput = document.getElementById('peso');
  if (pesoInput) {
    pesoInput.value = state.inputs.peso;
  }

  // Atualiza concentração
  const concentracaoInput = document.getElementById('concentracao');
  if (concentracaoInput) {
    concentracaoInput.value = state.inputs.concentracao;
  }

  // Atualiza unidade concentração
  const unidadeConcSelect = document.getElementById('unidadeConc');
  if (unidadeConcSelect) {
    unidadeConcSelect.value = state.inputs.unidadeConc;
  }

  // Atualiza volume total
  const volumeTotalInput = document.getElementById('volumeTotal');
  if (volumeTotalInput) {
    volumeTotalInput.value = state.inputs.volumeTotal;
  }

  // Atualiza medInfo
  const medInfoDiv = document.getElementById('medInfo');
  if (medInfoDiv) {
    if (state.outputs.medInfo) {
      const med = state.outputs.medInfo;
      medInfoDiv.innerHTML = `
        <strong>${med.nome}</strong> (${med.categoria})<br>
        Diluição padrão: ${med.diluicao}<br>
        Concentração: ${med.concentracao} ${med.unidadeConc}<br>
        <em>${med.observacoes}</em>
      `;
      medInfoDiv.style.display = 'block';
    } else if (state.inputs.medicamento === 'outros') {
      medInfoDiv.innerHTML = '<em>Preencha os campos manualmente para medicamentos personalizados</em>';
      medInfoDiv.style.display = 'block';
    } else {
      medInfoDiv.style.display = 'none';
    }
  }

  // Atualiza resultados
  const resultDiv = document.getElementById('result');
  const taxaInfusaoDiv = document.getElementById('taxaInfusao');
  const doseHoraDiv = document.getElementById('doseHora');
  const tempoFrascoDiv = document.getElementById('tempoFrasco');
  const tempoFrascoItem = document.getElementById('tempoFrascoItem');
  const goteirasMinDiv = document.getElementById('goteirasMin');
  const goteirasItem = document.getElementById('goteirasItem');

  if (resultDiv && taxaInfusaoDiv && doseHoraDiv) {
    if (state.outputs.taxaMLh !== null) {
      taxaInfusaoDiv.textContent = `${state.outputs.taxaMLh} mL/h`;
      doseHoraDiv.textContent = state.outputs.doseHora;
      
      if (state.outputs.tempoFrasco) {
        tempoFrascoDiv.textContent = state.outputs.tempoFrasco;
        tempoFrascoItem.style.display = 'block';
      } else {
        tempoFrascoItem.style.display = 'none';
      }
      
      if (state.outputs.goteirasMin) {
        goteirasMinDiv.textContent = state.outputs.goteirasMin;
        goteirasItem.style.display = 'block';
      } else {
        goteirasItem.style.display = 'none';
      }
      
      resultDiv.style.display = 'block';
    } else {
      resultDiv.style.display = 'none';
    }
  }
}

/**
 * Função para calcular a infusão
 */
export function calculateInfusion() {
  // Força recálculo
  updateInput('medicamento', state.inputs.medicamento);
  updateDOM();
}

// Mapeamento de ações para event delegation
export const actions = {
  calculateInfusion,
  copyResult,
  clearResult
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

  // Preenche campos automaticamente ao selecionar medicamento
  const medicamentoSelect = document.getElementById('medicamento');
  if (medicamentoSelect) {
    medicamentoSelect.addEventListener('change', function() {
      const medId = this.value;
      updateInput('medicamento', medId);
      
      if (medId && medId !== 'outros') {
        const med = getMedicamento(medId);
        if (med) {
          // Atualiza campos com valores padrão
          updateInput('dose', med.doseUsual.split('-')[0]);
          updateInput('unidadeDose', med.unidadeDose);
          updateInput('concentracao', med.concentracao);
          updateInput('unidadeConc', med.unidadeConc);
        }
      }
      
      updateDOM();
    });
  }

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

  // Adiciona evento para limpar ao clicar nos inputs
  const form = document.getElementById('infusionForm');
  if (form) {
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', clearResult);
    });
  }

  // Inicializa o DOM
  updateDOM();
});
