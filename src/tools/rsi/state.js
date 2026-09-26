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
