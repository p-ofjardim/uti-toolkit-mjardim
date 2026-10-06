/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */

var __mod_deficit_potassio_0 = (function () {
/**
 * Déficit total de potássio ajustado ao peso (Marino PL, The ICU Book, cap. Potassium).
 * Tabela de referência para adulto de 70 kg:
 * K 3,0 → 175 mEq; K 2,5 → 350; K 2,0 → 470; K 1,5 → 700; K 1,0 → 875.
 * Déficit (mEq) = valor da tabela × (peso ÷ 70).
 */
const DEFICIT_TABLE_70KG = [
  { potassium: 3.0, deficit: 175 },
  { potassium: 2.5, deficit: 350 },
  { potassium: 2.0, deficit: 470 },
  { potassium: 1.5, deficit: 700 },
  { potassium: 1.0, deficit: 875 },
];

const REFERENCE_WEIGHT_KG = 70;

/**
 * Retorna o valor-base do déficit da tabela de 70 kg para o potássio sérico dado,
 * interpolando linearmente entre os pontos da tabela (inclusive extrapolação).
 * Retorna null para entradas inválidas (não numéricas ou K <= 0).
 */
function baseDeficit70kg(potassium) {
  if (typeof potassium !== 'number' || !Number.isFinite(potassium) || potassium <= 0) {
    return null;
  }
  if (potassium >= 3.0) return 175 - (potassium - 3.0) * 150;
  const table = DEFICIT_TABLE_70KG;
  for (let i = 0; i < table.length - 1; i++) {
    const hi = table[i];
    const lo = table[i + 1];
    if (potassium <= hi.potassium && potassium >= lo.potassium) {
      const fraction = (hi.potassium - potassium) / (hi.potassium - lo.potassium);
      return hi.deficit + fraction * (lo.deficit - hi.deficit);
    }
  }
  const lowest = table[table.length - 1];
  const fraction = (lowest.potassium - potassium) / 0.5;
  return lowest.deficit + fraction * (lowest.deficit - 700 + 175);
}

/**
 * Calcula o déficit total de potássio ajustado ao peso (mEq).
 * Retorna null para entradas inválidas (peso <= 0).
 */
function calculateDeficitPotassio(potassium, weightKg) {
  const base = baseDeficit70kg(potassium);
  if (base === null) return null;
  if (typeof weightKg !== 'number' || !Number.isFinite(weightKg) || weightKg <= 0) {
    return null;
  }
  if (potassium >= 4.0) return 0;
  return base * (weightKg / REFERENCE_WEIGHT_KG);
}

/**
 * Faixa alternativa de estimativa do déficit para adulto de 70 kg
 * (mesma referência): K 3,0–3,5 → 100–200 mEq; K 2,5–2,9 → 200–400 mEq;
 * K 2,0–2,4 → 400–1000 mEq. Retorna null fora das faixas ou entradas inválidas.
 */
function faixaAlternativa70kg(potassium) {
  if (typeof potassium !== 'number' || !Number.isFinite(potassium)) return null;
  if (potassium >= 3.0 && potassium <= 3.5) return { min: 100, max: 200 };
  if (potassium >= 2.5 && potassium < 3.0) return { min: 200, max: 400 };
  if (potassium >= 2.0 && potassium < 2.5) return { min: 400, max: 1000 };
  return null;
}

function formatDeficitPotassioResult(deficit) {
  if (deficit === null || deficit === undefined) {
    return 'Informe potássio sérico (mEq/L) e peso (kg) válidos.';
  }
  const rounded = Math.round(deficit);
  if (deficit <= 0) return 'Déficit estimado: desprezível (K sérico ≥ 4,0 mEq/L).';
  return `Déficit estimado: <strong>${rounded} mEq</strong> de potássio para repor até ~4,0 mEq/L.`;
}
return { baseDeficit70kg: baseDeficit70kg, calculateDeficitPotassio: calculateDeficitPotassio, faixaAlternativa70kg: faixaAlternativa70kg, formatDeficitPotassioResult: formatDeficitPotassioResult };
})();

var __mod_gravidade_hipocalemia_1 = (function () {
/**
 * Classificação da gravidade da hipocalemia e conduta de reposição de KCl
 * (DynaMed, Hypokalemia in Adults; Marino PL, The ICU Book, cap. Potassium).
 *
 * Leve: K 3,0–3,5 → 60–80 mEq/dia VO em doses divididas (75 mEq/dia IV se
 * intolerância oral).
 * Moderada: K 2,5–3,0 → 40–120 mEq/dia VO a cada 3–4 h em 2–4 doses.
 * Grave: K < 2,5 → KCl 20–40 mEq/L IV a 10 mEq/h com monitorização;
 * reavaliar K a cada 2–4 h.
 * Urgência (arritmia, ECG alterado, fraqueza muscular): 5–10 mEq IV em
 * 15–20 min; reavaliar após 40–60 mEq.
 */
function classifyGravidadeHipocalemia(potassium, urgente) {
  if (typeof potassium !== 'number' || !Number.isFinite(potassium)) return null;
  if (potassium >= 4.0) {
    return {
      gravidade: 'normal',
      rotulo: 'Normocalemia',
      conduta: 'Sem indicação de reposição.',
    };
  }
  if (urgente) {
    return {
      gravidade: 'urgencia',
      rotulo: 'Urgência (arritmia, ECG alterado ou fraqueza muscular)',
      conduta: 'KCl 5–10 mEq IV em 15–20 min; reavaliar após 40–60 mEq.',
    };
  }
  if (potassium >= 3.0 && potassium < 4.0) {
    return {
      gravidade: 'leve',
      rotulo: 'Hipocalemia leve (K 3,0–3,5 mEq/L)',
      conduta: '60–80 mEq/dia VO em doses divididas (75 mEq/dia IV se intolerância oral).',
    };
  }
  if (potassium >= 2.5 && potassium < 3.0) {
    return {
      gravidade: 'moderada',
      rotulo: 'Hipocalemia moderada (K 2,5–3,0 mEq/L)',
      conduta: '40–120 mEq/dia VO a cada 3–4 h em 2–4 doses.',
    };
  }
  return {
    gravidade: 'grave',
    rotulo: 'Hipocalemia grave (K < 2,5 mEq/L)',
    conduta: 'KCl 20–40 mEq/L IV a 10 mEq/h com monitorização; reavaliar K a cada 2–4 h.',
  };
}

function formatGravidadeResult(classification) {
  if (!classification) return 'Informe o potássio sérico (mEq/L).';
  return `<strong>${classification.rotulo}</strong><br>${classification.conduta}`;
}
return { classifyGravidadeHipocalemia: classifyGravidadeHipocalemia, formatGravidadeResult: formatGravidadeResult };
})();

var __mod_limites_infusao_k_2 = (function () {
/**
 * Dose diária de KCl por gravidade da hipocalemia (DynaMed) e limites de
 * segurança da infusão IV (Marino PL, The ICU Book, cap. Potassium).
 *
 * Limites: 10–20 mEq/h pela periferia (0,5 mEq/kg/h até máximo de 10–20 mEq/h);
 * concentração máxima de 80 mEq/L na periferia; até 40 mEq/h apenas com via
 * central e monitorização contínua em situações excepcionais; nunca em bolus
 * fora da urgência. Na CAD: KCl 10–30 mEq/L/h para manter K entre 4 e 5 mEq/L;
 * reter insulina se K < 3,3 mEq/L; déficit médio de 3 a 5 mEq/kg.
 */
function limiteVelocidadePeriferica(weightKg) {
  if (typeof weightKg !== 'number' || !Number.isFinite(weightKg) || weightKg <= 0) {
    return null;
  }
  return { min: 10, max: 20, porPeso: 0.5 * weightKg };
}

function limiteVelocidadePorPeso(weightKg) {
  const periferica = limiteVelocidadePeriferica(weightKg);
  if (!periferica) return null;
  return Math.min(periferica.porPeso, 20);
}

/**
 * Valida a soma do aporte total de K do dia (KCl do dia + K do fosfato de
 * potássio) contra o limite de velocidade de infusão ajustado ao peso.
 * Retorna mensagem de texto pronta.
 */
function validarAporteTotalK(aporteTotalMEqDia, velocidadeMEqH, weightKg) {
  if (
    typeof aporteTotalMEqDia !== 'number' || !Number.isFinite(aporteTotalMEqDia) ||
    typeof velocidadeMEqH !== 'number' || !Number.isFinite(velocidadeMEqH)
  ) {
    return 'Informe aporte total e velocidade de infusão válidos.';
  }
  const limite = limiteVelocidadePorPeso(weightKg);
  if (limite === null) return 'Informe um peso válido para validar os limites.';
  const maxDia = limite * 24;
  let texto = `Limite pela periferia: ${limite.toFixed(0)} mEq/h e ~${Math.round(maxDia)} mEq em 24 h`;
  if (velocidadeMEqH > 20) {
    texto += '. ⚠️ Velocidade acima de 20 mEq/h exige via central e monitorização contínua.';
  } else if (velocidadeMEqH > limite) {
    texto += '. ⚠️ Velocidade acima do limite periférico ajustado ao peso.';
  }
  if (aporteTotalMEqDia > maxDia) {
    texto += ' ⚠️ Aporte total do dia excede o máximo seguro em infusão contínua.';
  }
  return texto;
}

function formatLimitesSeguranca(weightKg) {
  const limite = limiteVelocidadePorPeso(weightKg);
  if (limite === null) {
    return 'Velocidade periférica: 10–20 mEq/h (0,5 mEq/kg/h).';
  }
  return `Velocidade periférica: 10–20 mEq/h (0,5 mEq/kg/h → ${limite.toFixed(0)} mEq/h neste peso). Concentração máxima periférica: 80 mEq/L. Via central excepcional: até 40 mEq/h com monitorização contínua. Nunca bolus fora da urgência; cautela na insuficiência renal; verificar magnesemia na reposição refratária.`;
}
return { limiteVelocidadePeriferica: limiteVelocidadePeriferica, limiteVelocidadePorPeso: limiteVelocidadePorPeso, validarAporteTotalK: validarAporteTotalK, formatLimitesSeguranca: formatLimitesSeguranca };
})();

var __mod_fosfato_potassio_3 = (function () {
/**
 * Reposição de fosfato de potássio (KH₂PO₄) — Tabela 38.5 de Marino,
 * The ICU Book, cap. Calcium and Phosphorus.
 * Solução com 3 mmol de PO₄/mL e 4,3 mEq de K/mL.
 *
 * Dose (mmol) por fosfatemia (mg/dL) e faixa de peso:
 *   < 1,0 → 30/40/50 mmol (40–60 / 61–80 / 81–120 kg)
 *   1,0–1,7 → 20/30/40 mmol
 *   1,8–2,5 → 10/15/20 mmol
 * Volume (mL) = dose ÷ 3; K concomitante (mEq) = volume × 4,3;
 * tempo de infusão: 6 horas.
 * Seleção do sal: fosfato de potássio se K plasmático < 4 mEq/L;
 * fosfato de sódio se K ≥ 4 mEq/L.
 */
const PHOSPHATE_MMOL_PER_ML = 3;
const POTASSIUM_MEQ_PER_ML = 4.3;
const INFUSION_HOURS = 6;

function faixaPeso(weightKg) {
  if (typeof weightKg !== 'number' || !Number.isFinite(weightKg) || weightKg <= 0) {
    return null;
  }
  if (weightKg >= 40 && weightKg <= 60) return '40-60';
  if (weightKg > 60 && weightKg <= 80) return '61-80';
  if (weightKg > 80 && weightKg <= 120) return '81-120';
  return 'fora';
}

function doseTabela(phosphorus, faixa) {
  if (phosphorus < 1.0) return { '40-60': 30, '61-80': 40, '81-120': 50 }[faixa];
  if (phosphorus >= 1.0 && phosphorus <= 1.7) {
    return { '40-60': 20, '61-80': 30, '81-120': 40 }[faixa];
  }
  if (phosphorus >= 1.8 && phosphorus <= 2.5) {
    return { '40-60': 10, '61-80': 15, '81-120': 20 }[faixa];
  }
  return null;
}

function selecionarSal(potassium) {
  if (typeof potassium !== 'number' || !Number.isFinite(potassium)) return null;
  return potassium < 4
    ? 'fosfato de potássio'
    : 'fosfato de sódio';
}

function calculateFosfatoPotassio(phosphorus, weightKg) {
  if (typeof phosphorus !== 'number' || !Number.isFinite(phosphorus) || phosphorus < 0) {
    return null;
  }
  const faixa = faixaPeso(weightKg);
  if (!faixa || faixa === 'fora') return null;
  const dose = doseTabela(phosphorus, faixa);
  if (dose == null) return null;
  const volumeMl = dose / PHOSPHATE_MMOL_PER_ML;
  const potassiumMEq = volumeMl * POTASSIUM_MEQ_PER_ML;
  return {
    doseMmol: dose,
    volumeMl: Math.round(volumeMl * 10) / 10,
    potassiumMEq: Math.round(potassiumMEq * 10) / 10,
    infusionHours: INFUSION_HOURS,
  };
}

function formatFosfatoResult(result) {
  if (!result) {
    return 'Fosfato indicado apenas se < 1,0 mg/dL ou hipofosfatemia sintomática. Tabela válida para 40–120 kg e fosfatemia até 2,5 mg/dL.';
  }
  return `Dose: <strong>${result.doseMmol} mmol</strong> de PO₄ → ${result.volumeMl} mL da solução, ` +
    `com <strong>${result.potassiumMEq} mEq de K</strong> concomitante, em ${result.infusionHours} h.`;
}
return { selecionarSal: selecionarSal, calculateFosfatoPotassio: calculateFosfatoPotassio, formatFosfatoResult: formatFosfatoResult };
})();

var __mod_index_4 = (function (calculateDeficitPotassio, faixaAlternativa70kg, formatDeficitPotassioResult, classifyGravidadeHipocalemia, formatGravidadeResult, limiteVelocidadePorPeso, validarAporteTotalK, formatLimitesSeguranca, selecionarSal, calculateFosfatoPotassio, formatFosfatoResult) {
// Exporta todas as funções de cálculo de reposição de potássio
return { calculateDeficitPotassio: calculateDeficitPotassio, faixaAlternativa70kg: faixaAlternativa70kg, formatDeficitPotassioResult: formatDeficitPotassioResult, classifyGravidadeHipocalemia: classifyGravidadeHipocalemia, formatGravidadeResult: formatGravidadeResult, limiteVelocidadePorPeso: limiteVelocidadePorPeso, validarAporteTotalK: validarAporteTotalK, formatLimitesSeguranca: formatLimitesSeguranca, selecionarSal: selecionarSal, calculateFosfatoPotassio: calculateFosfatoPotassio, formatFosfatoResult: formatFosfatoResult };
})(__mod_deficit_potassio_0.calculateDeficitPotassio, __mod_deficit_potassio_0.faixaAlternativa70kg, __mod_deficit_potassio_0.formatDeficitPotassioResult, __mod_gravidade_hipocalemia_1.classifyGravidadeHipocalemia, __mod_gravidade_hipocalemia_1.formatGravidadeResult, __mod_limites_infusao_k_2.limiteVelocidadePorPeso, __mod_limites_infusao_k_2.validarAporteTotalK, __mod_limites_infusao_k_2.formatLimitesSeguranca, __mod_fosfato_potassio_3.selecionarSal, __mod_fosfato_potassio_3.calculateFosfatoPotassio, __mod_fosfato_potassio_3.formatFosfatoResult);

var __mod_state_5 = (function (calculations) {
/**
 * Gerenciador de estado para a calculadora de reposição de potássio
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */


const state = {
  inputs: {
    peso: 70,
    potassio: 3.0,
    urgencia: 'nao',
    fosfato: 1.2,
    'potassio-plasma': 3.1,
    'kcl-dia': 0,
  },
  outputs: {
    deficit: null,
    faixa: null,
    gravidade: null,
    fosfato: null,
    sal: null,
    aporteTotal: null,
  },
};

function updateInput(name, value) {
  state.inputs[name] = value;
}

function toNumber(value) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function calcular() {
  const peso = toNumber(state.inputs.peso);
  const potassio = toNumber(state.inputs.potassio);
  state.outputs.deficit = calculations.calculateDeficitPotassio(potassio, peso);
  state.outputs.faixa = calculations.faixaAlternativa70kg(potassio);
  state.outputs.gravidade = calculations.classifyGravidadeHipocalemia(
    potassio,
    state.inputs.urgencia === 'sim'
  );
}

function calcularFosfato() {
  const peso = toNumber(state.inputs.peso);
  const fosfato = toNumber(state.inputs.fosfato);
  const potassioPlasma = toNumber(state.inputs['potassio-plasma']);
  const kclDia = toNumber(state.inputs['kcl-dia']);
  state.outputs.fosfato = calculations.calculateFosfatoPotassio(fosfato, peso);
  state.outputs.sal = calculations.selecionarSal(potassioPlasma);
  const kFosfato = state.outputs.fosfato ? state.outputs.fosfato.potassiumMEq : 0;
  state.outputs.aporteTotal = {
    total: (kclDia || 0) + kFosfato,
    limite: calculations.limiteVelocidadePorPeso(peso),
  };
}

calcular();
calcularFosfato();
return { updateInput: updateInput, calcular: calcular, calcularFosfato: calcularFosfato, state: state };
})(__mod_index_4);

var __mod_feedback_6 = (function () {
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
    '<p>Esta estimativa parece errada? Avise-nos.</p>' +
    '<a class="feedback-link feedback-issue" href="' + issueUrl + '" target="_blank" rel="noopener">Reportar problema (GitHub)</a>' +
    '<a class="feedback-link feedback-mail" href="' + mailto + '">Reportar por e-mail</a>' +
    '<a class="feedback-link feedback-discussion" href="' + DISCUSSIONS_URL + '" target="_blank" rel="noopener">Tirar dúvida nas Discussions</a>';

  container.appendChild(box);
}
return { renderFeedback: renderFeedback, collectInputs: collectInputs, buildFeedbackBody: buildFeedbackBody, truncateBody: truncateBody, ISSUE_URL: ISSUE_URL, DISCUSSIONS_URL: DISCUSSIONS_URL, CONTACT_EMAIL: CONTACT_EMAIL };
})();

var __mod_ui_7 = (function (state, updateInput, calcular, calcularFosfato, calculations, renderFeedback) {
/**
 * Manipulação de DOM e eventos para a calculadora de reposição de potássio
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */




function updateDOM() {
  for (const [id, value] of Object.entries(state.inputs)) {
    const element = document.getElementById(id);
    if (element) element.value = value;
  }
  document.getElementById('deficit-result').innerHTML =
    calculations.formatDeficitPotassioResult(state.outputs.deficit);
  const faixa = state.outputs.faixa;
  document.getElementById('faixa-result').textContent = faixa
    ? `Faixa alternativa de estimativa (adulto de 70 kg): ${faixa.min}–${faixa.max} mEq.`
    : '';
  document.getElementById('gravidade-result').innerHTML =
    calculations.formatGravidadeResult(state.outputs.gravidade);
  document.getElementById('limites-result').textContent =
    calculations.formatLimitesSeguranca(parseFloat(state.inputs.peso));
  document.getElementById('fosfato-result').innerHTML =
    calculations.formatFosfatoResult(state.outputs.fosfato);
  const sal = state.outputs.sal;
  document.getElementById('sal-result').textContent = sal
    ? `Sal selecionado para K plasmático informado: ${sal} (fosfato de potássio se K < 4 mEq/L; fosfato de sódio se K ≥ 4 mEq/L).`
    : 'Informe o K plasmático para selecionar o sal.';
  const aporte = state.outputs.aporteTotal;
  document.getElementById('aporte-result').textContent = aporte
    ? `Aporte total de K do dia (KCl + K do fosfato): ${Math.round(aporte.total)} mEq. Limite de velocidade periférico ajustado ao peso: ${aporte.limite ? aporte.limite.toFixed(0) : '?'} mEq/h.`
    : '';
}

const actions = {
  calcular: () => {
    calcular();
    updateDOM();
  },
  calcularFosfato: () => {
    calcularFosfato();
    updateDOM();
  },
};



document.addEventListener('DOMContentLoaded', () => {
  renderFeedback('Reposição de potássio e fosfato');
  document.querySelectorAll('[data-action]').forEach((el) => {
    const action = el.getAttribute('data-action');
    if (actions[action]) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        actions[action](e);
      });
    }
  });
  document.querySelectorAll('input, select').forEach((input) => {
    const id = input.id;
    if (id) {
      input.addEventListener('input', () => {
        updateInput(id, input.value);
        calcular();
        calcularFosfato();
        updateDOM();
      });
      input.addEventListener('change', () => {
        updateInput(id, input.value);
        calcular();
        calcularFosfato();
        updateDOM();
      });
    }
  });
  updateDOM();
});
return { actions: actions };
})(__mod_state_5.state, __mod_state_5.updateInput, __mod_state_5.calcular, __mod_state_5.calcularFosfato, __mod_index_4, __mod_feedback_6.renderFeedback);