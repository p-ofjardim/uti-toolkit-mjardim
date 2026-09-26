/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */


// Exporta todas as funções de cálculo para infusão

export { medicamentos, getMedicamento, getAllMedicamentoIds } from './medicamentos.js';
export { calculateInfusionRate, calculateTempoFrasco, calculateGoteirasMin } from './infusion-rate.js';


/**
 * Gerenciador de estado para a calculadora de infusão
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */

import { 
  getMedicamento, 
  calculateInfusionRate, 
  calculateTempoFrasco, 
  calculateGoteirasMin 
} from './calculations/index.js';

// Estado inicial
const state = {
  inputs: {
    medicamento: '',
    dose: '',
    unidadeDose: 'mcg/kg/min',
    peso: 70,
    concentracao: '',
    unidadeConc: 'mg/mL',
    volumeTotal: ''
  },
  outputs: {
    taxaMLh: null,
    doseHora: null,
    tempoFrasco: null,
    goteirasMin: null,
    medInfo: null
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
  const medicamento = state.inputs.medicamento;
  const dose = parseFloat(state.inputs.dose) || 0;
  const peso = parseFloat(state.inputs.peso) || 0;
  const concentracao = parseFloat(state.inputs.concentracao) || 0;
  const volumeTotal = parseFloat(state.inputs.volumeTotal) || 0;
  
  // Obtém informações do medicamento
  if (medicamento && medicamento !== 'outros') {
    const med = getMedicamento(medicamento);
    if (med) {
      state.outputs.medInfo = med;
      
      // Preenche campos automaticamente se não foram alterados pelo usuário
      if (!state.inputs.dose || state.inputs.dose === '') {
        state.inputs.dose = med.doseUsual.split('-')[0];
      }
      if (!state.inputs.unidadeDose || state.inputs.unidadeDose === '') {
        state.inputs.unidadeDose = med.unidadeDose;
      }
      if (!state.inputs.concentracao || state.inputs.concentracao === '') {
        state.inputs.concentracao = med.concentracao;
      }
      if (!state.inputs.unidadeConc || state.inputs.unidadeConc === '') {
        state.inputs.unidadeConc = med.unidadeConc;
      }
    }
  } else {
    state.outputs.medInfo = null;
  }
  
  // Calcula taxa de infusão
  const result = calculateInfusionRate(
    dose,
    peso,
    state.inputs.unidadeDose,
    concentracao,
    state.inputs.unidadeConc
  );
  
  state.outputs.taxaMLh = result.taxaMLh;
  state.outputs.doseHora = result.doseHora;
  
  // Calcula tempo do frasco
  state.outputs.tempoFrasco = calculateTempoFrasco(volumeTotal, state.outputs.taxaMLh);
  
  // Calcula goteiras por minuto
  if (state.outputs.taxaMLh !== null) {
    state.outputs.goteirasMin = calculateGoteirasMin(state.outputs.taxaMLh);
  } else {
    state.outputs.goteirasMin = null;
  }
}

/**
 * Copia o resultado para a área de transferência
 */
export function copyResult() {
  if (!state.outputs.taxaMLh) {
    alert('Nenhum resultado para copiar');
    return;
  }
  
  const text = `Taxa de Infusão: ${state.outputs.taxaMLh} mL/h\n` +
                `Dose Total por Hora: ${state.outputs.doseHora}\n` +
                (state.outputs.tempoFrasco ? `Tempo do Frasco: ${state.outputs.tempoFrasco}\n` : '') +
                `Goteiras por Minuto: ${state.outputs.goteirasMin}`;
  
  navigator.clipboard.writeText(text).then(() => {
    alert('Texto copiado para a área de transferência!');
  }).catch(err => {
    alert('Erro ao copiar: ' + err);
  });
}

/**
 * Limpa o resultado
 */
export function clearResult() {
  // Não precisamos limpar o estado, apenas ocultar o resultado no DOM
}

// Inicializa o estado
recalculate();

// Exporta o estado e funções
export { state, updateInput, copyResult, clearResult };


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
