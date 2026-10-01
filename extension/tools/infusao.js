/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */

var __mod_medicamentos_0 = (function () {
/**
 * Dados dos medicamentos com diluições padrão do CTI
 * Cada medicamento contém: nome, categoria, diluição, concentração, dose usual, etc.
 */

const medicamentos = {
  // Aminas (Vasopressores/Inotrópicos)
  noradrenalina: {
    nome: 'Noradrenalina',
    categoria: 'Aminas',
    diluicao: '5 ampolas (4mg/8mL) + SGI 5% 180 mL',
    concentracao: 0.1, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.01-3',
    unidadeDose: 'mcg/kg/min',
    observacoes: '1ª linha para choque séptico. Progressão: 6-12-18-24 mL/h. Benefício menos claro quando dose > 1 mcg/kg/min'
  },
  dobutamina: {
    nome: 'Dobutamina',
    categoria: 'Aminas',
    diluicao: '2 ampolas (250mg/20mL) + SF 0.9% 210 mL',
    concentracao: 2, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '2-20',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Dobrada. Dose usual: 3-20 mcg/kg/h. Hipotensão em doses altas (reduz SVR)'
  },
  vasopressina: {
    nome: 'Vasopressina',
    categoria: 'Aminas',
    diluicao: '1 ampola (20U/1mL) + SF 0.9% 99 mL',
    concentracao: 0.2, // U/mL
    unidadeConc: 'U/mL',
    doseUsual: '0.03-0.04',
    unidadeDose: 'U/min',
    observacoes: 'Progressão: 6-12-18-24 mL/h. Adicionar quando noradrenalina ≥ 0.25-0.5 mcg/kg/min'
  },
  dopamina: {
    nome: 'Dopamina',
    categoria: 'Aminas',
    diluicao: '5 ampolas (50mg/10mL) + SF 0.9% 200 mL',
    concentracao: 1, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '2-20',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Dose usual: 5-20 mcg/kg/min. Contraindicado em feocromocitoma'
  },
  
  // Sedaçao/Analgesia
  fentanil: {
    nome: 'Fentanil',
    categoria: 'Sedação/Analgesia',
    diluicao: '4 ampolas (50 mcg/mL, 10 mL) + SF 0.9% 160 mL',
    concentracao: 10, // mcg/mL
    unidadeConc: 'mcg/mL',
    doseUsual: '0.7-10',
    unidadeDose: 'mcg/kg/h',
    observacoes: 'Menos hipotensão que morfina. Acumula em IR. Dose intermitente: 0.35-0.5 mcg/kg a cada 30-60 min'
  },
  midazolam: {
    nome: 'Midazolam',
    categoria: 'Sedação/Analgesia',
    diluicao: '4 ampolas (5 mg/mL, 10 mL) + SF 0.9% 160 mL',
    concentracao: 1, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.02-0.1',
    unidadeDose: 'mg/kg/h',
    observacoes: 'Status epileptico: solução pura = 1-2 mg/kg/h. Meia-vida prolongada em IC, IR, HF'
  },
  propofol: {
    nome: 'Propofol',
    categoria: 'Sedação/Analgesia',
    diluicao: '5 ampolas (10 mg/mL) - PURO',
    concentracao: 10, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '5-50',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Trocar solução a cada 12h. Máximo: 67 mcg/kg/min (4 mg/kg/h). Síndrome do propofol com infusão prolongada >70 mcg/kg/min'
  },
  cetamina: {
    nome: 'Cetamina',
    categoria: 'Sedação/Analgesia',
    diluicao: '2 ampolas (500 mg/10 mL) + SF 0.9% 80 mL',
    concentracao: 10, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '20-100',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Dose de ataque: 0.1-0.5 mg/kg. Metabólito ativo (norcetamina). Pode causar alucinações'
  },
  dexmedetomidina: {
    nome: 'Dexmedetomidina',
    categoria: 'Sedação/Analgesia',
    diluicao: '1 ampola (200 mcg/2 mL) + SF 0.9% 48 mL',
    concentracao: 4, // mcg/mL
    unidadeConc: 'mcg/mL',
    doseUsual: '0.2-1.5',
    unidadeDose: 'mcg/kg/h',
    observacoes: 'Reduzir dose em IR ou >65 anos. Risco de bradicardia e hipotensão'
  },
  
  // Bloqueadores Neuromusculares
  rocuronio: {
    nome: 'Rocurônio',
    categoria: 'Bloqueadores Neuromusculares',
    diluicao: '10 mg/mL (ampola) - PURO',
    concentracao: 10, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '4-16',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Duração prolongada 50% em IR hepática. Recuperação: 15-155 min'
  },
  cisatracurio: {
    nome: 'Cisatracúrio',
    categoria: 'Bloqueadores Neuromusculares',
    diluicao: '4 ampolas (2 mg/mL) + SF 0.9% 80 mL',
    concentracao: 0.4, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.5-10.2',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Meia-vida: 20-29 min. Liberação de histamina mínima'
  },
  
  // Vasodilatadores
  nitroprussiato: {
    nome: 'Nitroprussiato',
    categoria: 'Vasodilatadores',
    diluicao: '1 ampola (50 mg/2 mL) + SGI 5% 248 mL',
    concentracao: 0.2, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.3-10',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Iniciar 0.3-0.5 mcg/kg/min e titular em incrementos de 0.5 mcg/kg/min até BP alvo ou dose máxima de 10 mcg/kg/min. Monitorar cianeto. ACM'
  },
  nitroglicerina: {
    nome: 'Nitroglicerina',
    categoria: 'Vasodilatadores',
    diluicao: '1 ampola (50 mg/10 mL) + SGI 5% 240 mL',
    concentracao: 0.2, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '5-20',
    unidadeDose: 'mcg/min',
    observacoes: 'Dose inicial: 5 mcg/min, titular em incrementos de 5 mcg/min a cada 3-5 min, até 20 mcg/min. ACM'
  }
};

/**
 * Obtém as informações de um medicamento
 * @param {string} medId - ID do medicamento
 * @returns {Object|null} Informações do medicamento ou null se não encontrado
 */
function getMedicamento(medId) {
  return medicamentos[medId] || null;
}

/**
 * Obtém todos os IDs dos medicamentos
 * @returns {string[]} Array com todos os IDs
 */
function getAllMedicamentoIds() {
  return Object.keys(medicamentos);
}
return { medicamentos: medicamentos, getMedicamento: getMedicamento, getAllMedicamentoIds: getAllMedicamentoIds };
})();

var __mod_infusion_rate_1 = (function () {
/**
 * Calcula a taxa de infusão em mL/h
 * @param {number} dose - Dose desejada
 * @param {number} peso - Peso do paciente (kg)
 * @param {string} unidadeDose - Unidade da dose
 * @param {number} concentracao - Concentração da solução
 * @param {string} unidadeConc - Unidade da concentração
 * @returns {Object} Objeto com taxaMLh, doseHora, doseBase, doseBaseUnidade
 */
function calculateInfusionRate(dose, peso, unidadeDose, concentracao, unidadeConc) {
  if (isNaN(dose) || isNaN(peso) || isNaN(concentracao)) {
    return { 
      taxaMLh: null, 
      doseHora: null, 
      doseBase: null, 
      doseBaseUnidade: null,
      concBase: null,
      concBaseUnidade: null 
    };
  }
  
  // Converte dose para mcg/h ou mg/h (unidade base)
  let doseBase;
  let doseBaseUnidade = 'mcg/h';
  
  switch(unidadeDose) {
    case 'mcg/kg/min':
      doseBase = dose * peso * 60; // mcg/h
      break;
    case 'mcg/kg/h':
      doseBase = dose * peso; // mcg/h
      break;
    case 'mg/kg/h':
      doseBase = dose * peso * 1000; // mcg/h
      break;
    case 'mcg/min':
      doseBase = dose * 60; // mcg/h
      break;
    case 'mcg/h':
      doseBase = dose; // mcg/h
      break;
    case 'U/min':
      doseBase = dose * 60; // U/h
      doseBaseUnidade = 'U/h';
      break;
    case 'mg/min':
      doseBase = dose * 60 * 1000; // mcg/h
      break;
    default:
      doseBase = dose;
  }
  
  // Converte concentração para mg/mL ou U/mL (unidade base)
  let concBase;
  let concBaseUnidade = unidadeConc;
  
  switch(unidadeConc) {
    case 'mg/mL':
      concBase = concentracao; // mg/mL
      break;
    case 'mcg/mL':
      concBase = concentracao / 1000; // mg/mL
      break;
    case 'U/mL':
      concBase = concentracao; // U/mL
      concBaseUnidade = 'U/mL';
      break;
    default:
      concBase = concentracao;
  }
  
  // Calcula taxa de infusão em mL/h
  let taxaMLh;
  if (doseBaseUnidade === 'U/h' && concBaseUnidade === 'U/mL') {
    // Caso especial: U/h ÷ U/mL = mL/h
    taxaMLh = doseBase / concBase;
  } else if (doseBaseUnidade === 'mcg/h') {
    // Converte doseBase para mg/h
    const doseMGh = doseBase / 1000;
    // Taxa = dose (mg/h) / concentração (mg/mL)
    taxaMLh = doseMGh / concBase;
  } else {
    // Para outros casos (mg/h)
    taxaMLh = doseBase / concBase;
  }
  
  // Arredonda para 2 casas decimais
  taxaMLh = Math.round(taxaMLh * 100) / 100;
  
  // Formata dose por hora
  let doseHora;
  if (doseBaseUnidade === 'mcg/h') {
    doseHora = `${doseBase.toFixed(1)} mcg/h`;
  } else if (doseBaseUnidade === 'U/h') {
    doseHora = `${doseBase.toFixed(1)} U/h`;
  } else {
    doseHora = `${doseBase.toFixed(1)} mg/h`;
  }
  
  return { 
    taxaMLh, 
    doseHora, 
    doseBase, 
    doseBaseUnidade,
    concBase,
    concBaseUnidade 
  };
}

/**
 * Calcula o tempo do frasco
 * @param {number} volumeTotal - Volume total (mL)
 * @param {number} taxaMLh - Taxa de infusão (mL/h)
 * @returns {string} Tempo formatado (ex: "2h 30min (2.5 horas)")
 */
function calculateTempoFrasco(volumeTotal, taxaMLh) {
  if (volumeTotal <= 0 || taxaMLh <= 0) return '';
  
  const horas = volumeTotal / taxaMLh;
  const horasInt = Math.floor(horas);
  const minutos = Math.round((horas - horasInt) * 60);
  return `${horasInt}h ${minutos}min (${horas.toFixed(1)} horas)`;
}

/**
 * Calcula goteiras por minuto
 * @param {number} taxaMLh - Taxa de infusão (mL/h)
 * @returns {string} Goteiras por minuto formatado
 */
function calculateGoteirasMin(taxaMLh) {
  const goteiras = (taxaMLh * 20) / 60; // 1 mL = 20 goteiras
  const goteirasArredondadas = Math.round(goteiras * 10) / 10;
  return `${goteirasArredondadas} gts/min`;
}
return { calculateInfusionRate: calculateInfusionRate, calculateTempoFrasco: calculateTempoFrasco, calculateGoteirasMin: calculateGoteirasMin };
})();

var __mod_index_2 = (function (__reexport_medicamentos, __reexport_getMedicamento, __reexport_getAllMedicamentoIds, __reexport_calculateInfusionRate, __reexport_calculateTempoFrasco, __reexport_calculateGoteirasMin) {
// Exporta todas as funções de cálculo para infusão
return { medicamentos: __reexport_medicamentos, getMedicamento: __reexport_getMedicamento, getAllMedicamentoIds: __reexport_getAllMedicamentoIds, calculateInfusionRate: __reexport_calculateInfusionRate, calculateTempoFrasco: __reexport_calculateTempoFrasco, calculateGoteirasMin: __reexport_calculateGoteirasMin };
})(__mod_medicamentos_0.medicamentos, __mod_medicamentos_0.getMedicamento, __mod_medicamentos_0.getAllMedicamentoIds, __mod_infusion_rate_1.calculateInfusionRate, __mod_infusion_rate_1.calculateTempoFrasco, __mod_infusion_rate_1.calculateGoteirasMin);

var __mod_state_3 = (function (getMedicamento, calculateInfusionRate, calculateTempoFrasco, calculateGoteirasMin) {
/**
 * Gerenciador de estado para a calculadora de infusão
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */



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
function updateInput(name, value) {
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
function copyResult() {
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
function clearResult() {
  // Não precisamos limpar o estado, apenas ocultar o resultado no DOM
}

// Inicializa o estado
recalculate();

// Exporta o estado e funções
return { updateInput: updateInput, copyResult: copyResult, clearResult: clearResult, state: state };
})(__mod_index_2.getMedicamento, __mod_index_2.calculateInfusionRate, __mod_index_2.calculateTempoFrasco, __mod_index_2.calculateGoteirasMin);

var __mod_feedback_4 = (function () {
/**
 * Módulo de feedback clínico compartilhado
 * Renderiza um link de feedback no fim de cada ferramenta,
 * com contexto pré-preenchido (valores de entrada), sem exigir conta GitHub.
 */

var ISSUE_URL = 'https://github.com/p-ofjardim/uti-toolkit-mjardim/issues/new?template=bug-report.yml';
var DISCUSSIONS_URL = 'https://github.com/p-ofjardim/uti-toolkit-mjardim/discussions';
var CONTACT_EMAIL = 'p-ofjardim@users.noreply.github.com';

function collectInputs() {
  var inputs = document.querySelectorAll('input, select');
  var lines = [];
  inputs.forEach(function (el) {
    var label = null;
    if (el.id) {
      var labelEl = document.querySelector('label[for="' + el.id + '"]');
      if (labelEl) label = labelEl.textContent.trim();
    }
    if (!label) label = el.name || el.id || 'campo';
    var value = el.type === 'checkbox' || el.type === 'radio' ? (el.checked ? el.value : '') : el.value;
    if (value === '' || value == null) return;
    lines.push('- ' + label + ': ' + value);
  });
  return lines.join('\n');
}

function buildFeedbackBody(toolName) {
  var lines = [
    'Ferramenta: ' + toolName,
    '',
    'Valores usados:',
    collectInputs(),
    '',
    'O que eu esperava:',
    '',
    'O que apareceu:',
  ];
  return lines.join('\n');
}

function truncateBody(text) {
  if (text.length <= BODY_MAX_CHARS) return text;
  return text.slice(0, BODY_MAX_CHARS) + '\n(…texto truncado por limite de tamanho)';
}

function renderFeedback(toolName) {
  var container = document.querySelector('.container');
  if (!container || document.getElementById('clinical-feedback')) return;

  var body = encodeURIComponent(truncateBody(buildFeedbackBody(toolName)));
  var issueUrl = ISSUE_URL + '&title=' + encodeURIComponent('[' + toolName + '] Resultado parece errado') +
    '&body=' + body;
  var mailto = 'mailto:' + CONTACT_EMAIL +
    '?subject=' + encodeURIComponent('Feedback UTI Toolkit – ' + toolName) +
    '&body=' + body;

  var box = document.createElement('div');
  box.id = 'clinical-feedback';
  box.className = 'feedback-box';
  box.innerHTML =
    '<p>Esta estimativa parece errada? Avise-nos — não é preciso saber programar.</p>' +
    '<a class="feedback-link feedback-issue" href="' + issueUrl + '" target="_blank" rel="noopener">Reportar problema (GitHub)</a>' +
    '<a class="feedback-link feedback-mail" href="' + mailto + '">Reportar por e-mail</a>' +
    '<a class="feedback-link feedback-discussion" href="' + DISCUSSIONS_URL + '" target="_blank" rel="noopener">Tirar dúvida nas Discussions</a>';

  container.appendChild(box);
}
return { renderFeedback: renderFeedback, collectInputs: collectInputs, buildFeedbackBody: buildFeedbackBody, truncateBody: truncateBody, ISSUE_URL: ISSUE_URL, DISCUSSIONS_URL: DISCUSSIONS_URL, CONTACT_EMAIL: CONTACT_EMAIL };
})();

var __mod_ui_5 = (function (state, updateInput, copyResult, clearResult, getMedicamento, renderFeedback) {
/**
 * Manipulação de DOM e eventos para a calculadora de infusão
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */





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
function calculateInfusion() {
  // Força recálculo
  updateInput('medicamento', state.inputs.medicamento);
  updateDOM();
}

// Mapeamento de ações para event delegation
const actions = {
  calculateInfusion,
  copyResult,
  clearResult
};

// Inicializa o DOM
document.addEventListener('DOMContentLoaded', () => {
  renderFeedback('Infusão de Medicamentos');
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
return { calculateInfusion: calculateInfusion, actions: actions };
})(__mod_state_3.state, __mod_state_3.updateInput, __mod_state_3.copyResult, __mod_state_3.clearResult, __mod_index_2.getMedicamento, __mod_feedback_4.renderFeedback);