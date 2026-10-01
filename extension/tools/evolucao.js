/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */

var __mod_preencher_estabilidade_0 = (function () {
// Pure function to return stability defaults
// Returns an object with all field values for clinical stability
function preencherEstabilidade() {
  return {
    ventilac: 'Estabilidade em ar ambiente',
    neuro: 'Estável',
    rass: '',
    sedacao: 'Sem sedação',
    atb: 'Sem antibiótico',
    febre: 'Afebril',
    infecto: 'Sem critérios infecciosos',
    diurese: 'Diurese satisfatória',
    diuretico: 'Sem diurético',
    bh: 'Neutro',
    'esc-renal': 'Função renal preservada',
    hemato: 'Estável',
    hemoterapia: 'Sem hemoterapia',
    glicemias: 'Normoglicêmico',
    dhes: 'Sem DHEs',
    bic: 'Sem DABs',
    dieta: 'Via oral',
    'disf-tgi': 'Sem disfunção do TGI',
    evacuac: 'Evacuações presentes',
    cvc: 'Sem CVC',
    cdl: 'Sem CDL',
    pia: 'Sem PIA',
    svd: 'Sem SVD',
    'les-pele': 'Sem lesões de pele',
    profilax: 'Sem profilaxias farmacológicas',
    nora: '',
    vaso: '',
    dobuta: '',
    tridil: '',
    nipride: '',
    'ventilac-valor': '',
    vm: '',
    adapt: '',
    'dieta-valor': ''
  };
}
return { preencherEstabilidade: preencherEstabilidade };
})();

var __mod_limpar_formulario_1 = (function () {
// Pure function to return empty state for all form fields
// Returns an object with all field values set to empty strings
function limparFormulario() {
  return {
    nora: '',
    vaso: '',
    dobuta: '',
    tridil: '',
    nipride: '',
    ventilac: '',
    'ventilac-valor': '',
    vm: '',
    adapt: '',
    neuro: '',
    rass: '',
    sedacao: '',
    atb: '',
    febre: '',
    infecto: '',
    diurese: '',
    diuretico: '',
    bh: '',
    'esc-renal': '',
    hemato: '',
    hemoterapia: '',
    glicemias: '',
    dhes: '',
    bic: '',
    dieta: '',
    'dieta-valor': '',
    'disf-tgi': '',
    evacuac: '',
    cvc: '',
    cdl: '',
    pia: '',
    svd: '',
    'les-pele': '',
    profilax: ''
  };
}
return { limparFormulario: limparFormulario };
})();

var __mod_atualizar_opcoes_diurese_2 = (function () {
// Pure function to return gender-specific diurese options
// Returns object with oligurico/anurico options based on gender
function atualizarOpcoesDiurese(sexo) {
  const isFem = sexo === 'F';
  return {
    oligurico: isFem ? 'Oligúrica' : 'Oligúrico',
    anurico: isFem ? 'Anúrica' : 'Anúrico'
  };
}
return { atualizarOpcoesDiurese: atualizarOpcoesDiurese };
})();

var __mod_ajustar_genero_3 = (function () {
// Pure function to adjust gender-specific terms in text
// Takes text and gender, returns adjusted text
function ajustarGenero(texto, sexo) {
  if (sexo === 'F') {
    const substituirPreservandoCaixa = (masculino, feminino) =>
      texto.replace(new RegExp(masculino, 'gi'), (match) =>
        match === match.toUpperCase() ? feminino.toUpperCase() : feminino
      );

    texto = substituirPreservandoCaixa('adaptado', 'adaptada');
    texto = substituirPreservandoCaixa('oligúrico', 'oligúrica');
    texto = substituirPreservandoCaixa('anúrico', 'anúrica');
    texto = substituirPreservandoCaixa('normoglicêmico', 'normoglicêmica');
    texto = substituirPreservandoCaixa('disglicêmico', 'disglicêmica');
    texto = substituirPreservandoCaixa('hipoglicêmico', 'hipoglicêmica');
    texto = substituirPreservandoCaixa('hipotérmico', 'hipotérmica');
  }
  return texto;
}
return { ajustarGenero: ajustarGenero };
})();

var __mod_processar_hemodinamica_4 = (function () {
// Pure function: processes hemodynamics section
// Input: nora, vaso, dobuta, tridil, nipride (all strings)
// Output: string describing hemodynamic state
function processarHemodinamica(nora, vaso, dobuta, tridil, nipride) {
  const temDroga = (valor) => valor && parseFloat(valor) > 0;

  // Se todos vazios ou zero
  if (
    !temDroga(nora) &&
    !temDroga(vaso) &&
    !temDroga(dobuta) &&
    !temDroga(tridil) &&
    !temDroga(nipride)
  ) {
    return 'Estabilidade hemodinâmica.';
  }

  // Se algum tem valor
  const drogas = [];
  if (nora) drogas.push(`Noradrenalina a ${nora} mL/h`);
  if (vaso) drogas.push(`Vasopressina a ${vaso} U/min`);
  if (dobuta) drogas.push(`Dobutamina a ${dobuta} mcg/kg/min`);
  if (tridil) drogas.push(`Nitroglicerina a ${tridil} mcg/min`);
  if (nipride) drogas.push(`Nitroprussiato a ${nipride} mcg/kg/min`);

  return `Instabilidade hemodinâmica, em uso de ${drogas.join(', ')}.`;
}
return { processarHemodinamica: processarHemodinamica };
})();

var __mod_processar_ventilacao_5 = (function () {
// Pure function: processes ventilation section
// Input: ventilac, ventilacValor, vm, adapt (all strings)
// Output: string describing ventilation state
function processarVentilacao(ventilac, ventilacValor, vm, adapt) {
  if (!ventilac) return '';

  let texto = '';

  switch (ventilac) {
    case 'Estabilidade em ar ambiente':
      texto = 'Estabilidade ventilatória';
      break;
    case 'Estabilidade em oxigenoterapia':
      texto = 'Estabilidade ventilatória, em oxigenoterapia de baixo fluxo';
      break;
    case 'Traqueostomia com oxigenoterapia':
      texto = 'Estabilidade ventilatória, em oxigenoterapia pela traqueostomia';
      break;
    case 'Traqueostomia em ar ambiente':
      texto = 'Estabilidade ventilatória, traqueostomia em ar ambiente';
      break;
    case 'Instabilidade':
      texto = 'Instabilidade ventilatória';
      break;
    case 'Masc. Alto Fluxo':
      texto = `Instabilidade ventilatória, em uso de máscara de alto fluxo a ${ventilacValor || '???'} L/min`;
      break;
    case 'Masc. Venturi':
      texto = `Instabilidade ventilatória, em uso de máscara de Venturi a ${ventilacValor || '???'}%`;
      break;
    default:
      return '';
  }

  // Adiciona VM e adaptação se preenchidos
  if (vm) {
    const adaptText = adapt ? `, ${adapt.toLowerCase()}` : '';
    texto += ` em ${vm}${adaptText}`;
  }

  return texto + '.';
}
return { processarVentilacao: processarVentilacao };
})();

var __mod_processar_neuro_6 = (function () {
// Pure function: processes neurology section
// Input: neuro, rass, sedacao (all strings)
// Output: string describing neurological state
function processarNeuro(neuro, rass, sedacao) {
  if (!neuro) return '';

  let texto = neuro === 'Estável' ? 'Estabilidade neurológica' : 'Instabilidade neurológica';

  if (rass) {
    texto += `, RASS ${rass}`;
  }

  if (sedacao) {
    texto += `; ${sedacao.toLowerCase()}`;
  }

  return texto + '.';
}
return { processarNeuro: processarNeuro };
})();

var __mod_processar_infecto_7 = (function () {
// Pure function: processes infection section
// Input: atb, febre, infecto (all strings)
// Output: string describing infection state
function processarInfecto(atb, febre, infecto) {
  const partes = [];
  if (atb) partes.push(atb);
  if (febre) partes.push(febre.toLowerCase());
  if (infecto) partes.push(infecto.toLowerCase());

  if (partes.length === 0) return '';

  return partes.join(', ') + '.';
}
return { processarInfecto: processarInfecto };
})();

var __mod_processar_renal_8 = (function () {
// Pure function: processes renal section
// Input: diurese, diuretico, bh, escRenal (all strings)
// Output: string describing renal state
function processarRenal(diurese, diuretico, bh, escRenal) {
  const partes = [];
  if (diurese) partes.push(diurese);
  if (diuretico) partes.push(diuretico.toLowerCase());
  if (bh) partes.push(`balanço hídrico ${bh.toLowerCase()}`);
  if (escRenal) partes.push(escRenal.toLowerCase());

  if (partes.length === 0) return '';

  // Formata com ponto e vírgula
  return partes.join('; ') + '.';
}
return { processarRenal: processarRenal };
})();

var __mod_processar_hematologico_9 = (function () {
// Pure function: processes hematology section
// Input: hemato, hemoterapia (strings)
// Output: string describing hematological state
function processarHematologico(hemato, hemoterapia) {
  if (!hemato) return '';

  let texto = hemato === 'Estável' ? 'Estabilidade hematológica' : 'Instabilidade hematológica';

  if (hemoterapia && hemoterapia !== 'Sem hemoterapia') {
    texto += `, ${hemoterapia.toLowerCase()}`;
  }

  return texto.charAt(0).toUpperCase() + texto.slice(1) + '.';
}
return { processarHematologico: processarHematologico };
})();

var __mod_processar_metabolico_10 = (function () {
// Pure function: processes metabolic section
// Input: glicemias, dhes, bic (all strings)
// Output: string describing metabolic state
function processarMetabolico(glicemias, dhes, bic) {
  // Valores considerados "normais"
  const glicemiasNormal = glicemias === 'Normoglicêmico' || !glicemias;
  const dhesNormal = dhes === 'Sem DHEs' || !dhes;
  const bicNormal = bic === 'Sem DABs' || !bic;

  // Se todos estiverem normais
  if (glicemiasNormal && dhesNormal && bicNormal) {
    return 'Estabilidade metabólica.';
  }

  // Caso contrário, lista apenas os não normais
  const partes = [];
  if (glicemias && !glicemiasNormal) partes.push(glicemias.toLowerCase());
  if (dhes && !dhesNormal) partes.push(dhes);
  if (bic && !bicNormal) partes.push(bic.toLowerCase());

  if (partes.length === 0) return '';

  return 'Instabilidade metabólica; ' + partes.join('; ') + '.';
}
return { processarMetabolico: processarMetabolico };
})();

var __mod_processar_nutricao_11 = (function () {
// Pure function: processes nutrition section
// Input: dieta, dietaValor, disfTgi, evacuac (all strings)
// Output: string describing nutrition state
function processarNutricao(dieta, dietaValor, disfTgi, evacuac) {
  const partes = [];
  if (dieta) {
    if (dieta === 'Dieta enteral' && dietaValor) {
      partes.push(`Tolerando dieta enteral a ${dietaValor}`);
    } else if (dieta === 'NPT') {
      partes.push(`Tolerando ${dieta} a ${dietaValor || '???'} mL/h`);
    } else if (dieta === 'NPP') {
      partes.push(`Tolerando ${dieta} a ${dietaValor || '???'} mL/h`);
    } else if (dieta === 'Via oral') {
      partes.push('Tolerando dieta via oral');
    } else if (dieta) {
      partes.push(dieta.charAt(0).toUpperCase() + dieta.slice(1));
    }
  }
  if (disfTgi && disfTgi !== 'Sem disfunção do TGI') {
    partes.push(disfTgi.toLowerCase());
  }
  if (evacuac) {
    partes.push(evacuac.toLowerCase());
  }

  if (partes.length === 0) return '';

  return partes.join('; ') + '.';
}
return { processarNutricao: processarNutricao };
})();

var __mod_processar_lesoes_pele_12 = (function () {
// Pure function: processes skin lesions section
// Input: lesPele (string)
// Output: string describing skin lesion state
function processarLesoesPele(lesPele) {
  if (!lesPele) return '';
  return lesPele + '.';
}
return { processarLesoesPele: processarLesoesPele };
})();

var __mod_processar_invasoes_13 = (function () {
// Pure function: processes invasions section
// Input: cvc, cdl, pia, svd (all strings)
// Output: string describing invasion state
function processarInvasoes(cvc, cdl, pia, svd) {
  const invasoes = [];
  if (cvc && cvc !== 'Sem CVC') invasoes.push(`CVC em ${cvc}`);
  if (cdl && cdl !== 'Sem CDL') invasoes.push(`CDL em ${cdl}`);
  if (pia && pia !== 'Sem PIA') invasoes.push(`PIA em ${pia}`);
  if (svd === 'Com SVD') invasoes.push('em uso de SVD');

  if (invasoes.length === 0) {
    return 'Sem invasões.';
  }

  return invasoes.join('; ') + '.';
}
return { processarInvasoes: processarInvasoes };
})();

var __mod_processar_profilaxia_14 = (function () {
// Pure function: processes prophylaxis section
// Input: profilax (string)
// Output: string describing prophylaxis state
function processarProfilaxia(profilax) {
  if (!profilax) return '';
  return profilax + '.';
}
return { processarProfilaxia: processarProfilaxia };
})();

var __mod_gerar_evolucao_15 = (function (processarHemodinamica, processarVentilacao, processarNeuro, processarInfecto, processarRenal, processarHematologico, processarMetabolico, processarNutricao, processarLesoesPele, processarInvasoes, processarProfilaxia) {
// Pure function: orchestrates all section processors to generate evolution text
// Input: all form inputs as an object
// Output: final evolution text string

// Import all processor functions












function gerarEvolucao(inputs) {
  const {
    box,
    data,
    sexo,
    nora,
    vaso,
    dobuta,
    tridil,
    nipride,
    ventilac,
    'ventilac-valor': ventilacValor,
    vm,
    adapt,
    neuro,
    rass,
    sedacao,
    atb,
    febre,
    infecto,
    diurese,
    diuretico,
    bh,
    'esc-renal': escRenal,
    hemato,
    hemoterapia,
    glicemias,
    dhes,
    bic,
    dieta,
    'dieta-valor': dietaValor,
    'disf-tgi': disfTgi,
    evacuac,
    cvc,
    cdl,
    pia,
    svd,
    'les-pele': lesPele,
    profilax
  } = inputs;

  const linhas = [];

  // 1. HEMODINÂMICA
  const hemoText = processarHemodinamica(nora, vaso, dobuta, tridil, nipride);
  if (hemoText) linhas.push(hemoText);

  // 2. VENTILAÇÃO
  const ventText = processarVentilacao(ventilac, ventilacValor, vm, adapt);
  if (ventText) linhas.push(ventText);

  // 3. NEUROLÓGICO + SEDAÇÃO
  const neuroText = processarNeuro(neuro, rass, sedacao);
  if (neuroText) linhas.push(neuroText);

  // 4. INFECÇÃO
  const infectoText = processarInfecto(atb, febre, infecto);
  if (infectoText) linhas.push(infectoText);

  // 5. RENAL
  const renalText = processarRenal(diurese, diuretico, bh, escRenal);
  if (renalText) linhas.push(renalText);

  // 6. HEMATOLÓGICO
  const hematologicoText = processarHematologico(hemato, hemoterapia);
  if (hematologicoText) linhas.push(hematologicoText);

  // 7. METABÓLICO
  const metabolicoText = processarMetabolico(glicemias, dhes, bic);
  if (metabolicoText) linhas.push(metabolicoText);

  // 8. NUTRIÇÃO + ELIMINAÇÃO
  const nutricaoText = processarNutricao(dieta, dietaValor, disfTgi, evacuac);
  if (nutricaoText) linhas.push(nutricaoText);

  // 9. LESÕES DE PELE
  const lesoesPeleText = processarLesoesPele(lesPele);
  if (lesoesPeleText) linhas.push(lesoesPeleText);

  // 10. INVASÕES
  const invasoesText = processarInvasoes(cvc, cdl, pia, svd);
  if (invasoesText) linhas.push(invasoesText);

  // 11. PROFILAXIA
  const profilaxiaText = processarProfilaxia(profilax);
  if (profilaxiaText) linhas.push(profilaxiaText);

  // Monta o texto final
  let textoFinal = `# Box ${box}\n\n`;
  textoFinal += linhas.join('\n\n');

  return textoFinal;
}
return { gerarEvolucao: gerarEvolucao };
})(__mod_processar_hemodinamica_4.processarHemodinamica, __mod_processar_ventilacao_5.processarVentilacao, __mod_processar_neuro_6.processarNeuro, __mod_processar_infecto_7.processarInfecto, __mod_processar_renal_8.processarRenal, __mod_processar_hematologico_9.processarHematologico, __mod_processar_metabolico_10.processarMetabolico, __mod_processar_nutricao_11.processarNutricao, __mod_processar_lesoes_pele_12.processarLesoesPele, __mod_processar_invasoes_13.processarInvasoes, __mod_processar_profilaxia_14.processarProfilaxia);

var __mod_index_16 = (function (__reexport_preencherEstabilidade, __reexport_limparFormulario, __reexport_atualizarOpcoesDiurese, __reexport_ajustarGenero, __reexport_processarHemodinamica, __reexport_processarVentilacao, __reexport_processarNeuro, __reexport_processarInfecto, __reexport_processarRenal, __reexport_processarHematologico, __reexport_processarMetabolico, __reexport_processarNutricao, __reexport_processarLesoesPele, __reexport_processarInvasoes, __reexport_processarProfilaxia, __reexport_gerarEvolucao) {
// Central export for all evolucao calculations
return { preencherEstabilidade: __reexport_preencherEstabilidade, limparFormulario: __reexport_limparFormulario, atualizarOpcoesDiurese: __reexport_atualizarOpcoesDiurese, ajustarGenero: __reexport_ajustarGenero, processarHemodinamica: __reexport_processarHemodinamica, processarVentilacao: __reexport_processarVentilacao, processarNeuro: __reexport_processarNeuro, processarInfecto: __reexport_processarInfecto, processarRenal: __reexport_processarRenal, processarHematologico: __reexport_processarHematologico, processarMetabolico: __reexport_processarMetabolico, processarNutricao: __reexport_processarNutricao, processarLesoesPele: __reexport_processarLesoesPele, processarInvasoes: __reexport_processarInvasoes, processarProfilaxia: __reexport_processarProfilaxia, gerarEvolucao: __reexport_gerarEvolucao };
})(__mod_preencher_estabilidade_0.preencherEstabilidade, __mod_limpar_formulario_1.limparFormulario, __mod_atualizar_opcoes_diurese_2.atualizarOpcoesDiurese, __mod_ajustar_genero_3.ajustarGenero, __mod_processar_hemodinamica_4.processarHemodinamica, __mod_processar_ventilacao_5.processarVentilacao, __mod_processar_neuro_6.processarNeuro, __mod_processar_infecto_7.processarInfecto, __mod_processar_renal_8.processarRenal, __mod_processar_hematologico_9.processarHematologico, __mod_processar_metabolico_10.processarMetabolico, __mod_processar_nutricao_11.processarNutricao, __mod_processar_lesoes_pele_12.processarLesoesPele, __mod_processar_invasoes_13.processarInvasoes, __mod_processar_profilaxia_14.processarProfilaxia, __mod_gerar_evolucao_15.gerarEvolucao);

var __mod_state_17 = (function (preencherEstabilidade, limparFormulario, ajustarGenero, gerarEvolucao) {
// Central state management for evolucao tool


// Define all input fields
const inputFields = [
  'box', 'data', 'sexo',
  'nora', 'vaso', 'dobuta', 'tridil', 'nipride',
  'ventilac', 'ventilac-valor', 'vm', 'adapt',
  'neuro', 'rass', 'sedacao',
  'atb', 'febre', 'infecto',
  'diurese', 'diuretico', 'bh', 'esc-renal',
  'hemato', 'hemoterapia',
  'glicemias', 'dhes', 'bic',
  'dieta', 'dieta-valor', 'disf-tgi', 'evacuac',
  'cvc', 'cdl', 'pia', 'svd', 'les-pele', 'profilax'
];

// State object
const state = {
  inputs: {},
  outputs: {
    resultadoText: ''
  }
};

// Initialize state with default values
function initializeState() {
  inputFields.forEach(field => {
    state.inputs[field] = '';
  });
  // Set default values
  state.inputs.box = '11';
  state.inputs.sexo = 'M';
  state.inputs.data = new Date().toISOString().split('T')[0];
}

// Update an input field and trigger recalculation
function updateInput(field, value) {
  if (inputFields.includes(field)) {
    state.inputs[field] = value;
    recalculate();
  }
}

// Recalculate all outputs based on current inputs
function recalculate() {
  const inputs = { ...state.inputs };
  
  // Generate the evolution text
  const rawText = gerarEvolucao(inputs);
  
  // Adjust gender
  const finalText = ajustarGenero(rawText, inputs.sexo);
  
  state.outputs.resultadoText = finalText;
}

// Fill form with stability defaults
function fillEstabilidade() {
  const defaults = preencherEstabilidade();
  Object.entries(defaults).forEach(([field, value]) => {
    if (inputFields.includes(field)) {
      state.inputs[field] = value;
    }
  });
  recalculate();
}

// Clear form
function clearFormulario() {
  const cleared = limparFormulario();
  Object.entries(cleared).forEach(([field, value]) => {
    if (inputFields.includes(field)) {
      state.inputs[field] = value;
    }
  });
  recalculate();
}

// Copy result to clipboard
async function copyResult() {
  const text = state.outputs.resultadoText;
  if (!text || text.trim() === '') {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error copying:', err);
    return false;
  }
}

// Update diurese options based on gender
function updateDiureseOptions(sexo) {
  // This will be handled by UI
  state.inputs.sexo = sexo;
  recalculate();
}

// Get current state
function getState() {
  return {
    inputs: { ...state.inputs },
    outputs: { ...state.outputs }
  };
}

// Initialize
initializeState();

// Export everything
return { state: state, updateInput: updateInput, recalculate: recalculate, preencherEstabilidade: fillEstabilidade, limparFormulario: clearFormulario, copyResult: copyResult, atualizarOpcoesDiurese: updateDiureseOptions, getState: getState };
})(__mod_index_16.preencherEstabilidade, __mod_index_16.limparFormulario, __mod_index_16.ajustarGenero, __mod_index_16.gerarEvolucao);

var __mod_feedback_18 = (function () {
/**
 * Módulo de feedback clínico compartilhado
 * Renderiza um link de feedback no fim de cada ferramenta,
 * com contexto pré-preenchido (valores de entrada), sem exigir conta GitHub.
 */

var ISSUE_URL = 'https://github.com/p-ofjardim/uti-toolkit-mjardim/issues/new?template=bug-report.yml';
var DISCUSSIONS_URL = 'https://github.com/p-ofjardim/uti-toolkit-mjardim/discussions';
var CONTACT_EMAIL = 'p-ofjardim@users.noreply.github.com';
var BODY_MAX_CHARS = 2000;

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

var __mod_ui_19 = (function (state, updateInput, preencherEstabilidade, limparFormulario, copyResult, atualizarOpcoesDiurese, renderFeedback) {
// UI management for evolucao tool



// DOM elements cache
const elements = {};

// Initialize UI: bind events and populate form
function init() {
  renderFeedback('Evolução Clínica');
  // Cache all elements with data-field or data-action
  document.querySelectorAll('[data-field]').forEach(el => {
    const field = el.getAttribute('data-field');
    elements[field] = el;
    
    // Set initial value from state
    if (state.inputs[field] !== undefined) {
      el.value = state.inputs[field];
    }
    
    // Bind input change
    el.addEventListener('input', () => {
      updateInput(field, el.value);
    });
    
    // Special handling for date field
    if (field === 'data' && !el.value) {
      el.value = new Date().toISOString().split('T')[0];
      updateInput(field, el.value);
    }
  });

  // Cache result textarea
  const resultadoEl = document.getElementById('resultado');
  if (resultadoEl) {
    elements.resultado = resultadoEl;
  }

  // Bind action buttons
  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.getAttribute('data-action');
    
    switch (action) {
      case 'preencherEstabilidade':
        el.addEventListener('click', () => {
          preencherEstabilidade();
          syncForm();
        });
        break;
      case 'limparFormulario':
        el.addEventListener('click', () => {
          limparFormulario();
          syncForm();
        });
        break;
      case 'gerarEvolucao':
        el.addEventListener('click', () => {
          // Already handled by state recalculation on input changes
          // But we can force a recalc if needed
          syncResult();
        });
        break;
      case 'copyResult':
        el.addEventListener('click', async () => {
          const success = await copyResult();
          if (success) {
            alert('Texto copiado para a área de transferência!');
          } else {
            alert('Erro ao copiar ou nenhum texto para copiar');
          }
        });
        break;
    }
  });

  // Bind gender change to update diurese options
  const sexoEl = document.getElementById('sexo');
  if (sexoEl) {
    sexoEl.addEventListener('change', () => {
      const sexo = sexoEl.value;
      updateInput('sexo', sexo);
      atualizarOpcoesDiurese(sexo);
      updateDiureseSelect(sexo);
    });
  }

  // Initial sync
  syncForm();
  syncResult();

  // Setup observer for state changes
  setupStateObserver();
}

// Sync form fields with state
function syncForm() {
  Object.entries(state.inputs).forEach(([field, value]) => {
    const el = elements[field];
    if (el && el.value !== value) {
      el.value = value;
    }
  });
}

// Sync result textarea with state
function syncResult() {
  const resultadoEl = elements.resultado;
  if (resultadoEl && resultadoEl.value !== state.outputs.resultadoText) {
    resultadoEl.value = state.outputs.resultadoText;
  }
}

// Update diurese select options based on gender
function updateDiureseSelect(sexo) {
  const isFem = sexo === 'F';
  const select = document.getElementById('diurese');
  if (!select) return;

  const pares = [
    ['Oligúrico', 'Oligúrica'],
    ['Anúrico', 'Anúrica']
  ];

  const currentVal = select.value;
  pares.forEach(([masc, fem]) => {
    const opt = Array.from(select.options).find(o => o.value === masc || o.value === fem);
    if (!opt) return;
    const novo = isFem ? fem : masc;
    opt.value = novo;
    opt.text = novo;
    if (currentVal === masc || currentVal === fem) select.value = novo;
  });
}

// Setup observer for state changes
function setupStateObserver() {
  // Simple polling for state changes (since we can't use Proxy in all environments)
  setInterval(() => {
    syncResult();
  }, 100);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
return { init: init, syncForm: syncForm, syncResult: syncResult, updateDiureseSelect: updateDiureseSelect };
})(__mod_state_17.state, __mod_state_17.updateInput, __mod_state_17.preencherEstabilidade, __mod_state_17.limparFormulario, __mod_state_17.copyResult, __mod_state_17.atualizarOpcoesDiurese, __mod_feedback_18.renderFeedback);