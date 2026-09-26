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
