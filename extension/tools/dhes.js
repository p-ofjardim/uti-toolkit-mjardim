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

var __mod_tbw_percentage_4 = (function () {
/**
 * Calcula a porcentagem de TBW (Total Body Water) com base em idade e sexo
 * @param {number} age - Idade em anos
 * @param {string} gender - Sexo ('male' ou 'female')
 * @returns {number} Porcentagem de TBW (0.45 a 0.6)
 */
function calculateTBWPercentage(age, gender) {
  if (age >= 65) {
    // Idoso
    return gender === 'male' ? 0.5 : 0.45;
  } else {
    // Adulto
    return gender === 'male' ? 0.6 : 0.5;
  }
}
return { calculateTBWPercentage: calculateTBWPercentage };
})();

var __mod_water_deficit_5 = (function () {
/**
 * Calcula o déficit de água livre usando a fórmula de Adrogue-Madias (NEJM 2000)
 * @param {number} sodium - Sódio sérico atual (mEq/L)
 * @param {number} desiredSodium - Sódio desejado (mEq/L)
 * @param {number} weight - Peso do paciente (kg)
 * @param {number} tbwPercentage - Porcentagem de TBW (Total Body Water)
 * @returns {number} Déficit de água livre em litros
 */
function calculateWaterDeficit(sodium, desiredSodium, weight, tbwPercentage) {
  // Fórmula: Déficit (L) = %TBW × Peso × (Na_atual / Na_desejado - 1)
  return tbwPercentage * weight * (sodium / desiredSodium - 1);
}
return { calculateWaterDeficit: calculateWaterDeficit };
})();

var __mod_correction_rate_6 = (function () {
/**
 * Calcula a taxa de correção máxima recomendada (8-10 mEq/L em 24h)
 * @param {number} currentDifference - Diferença atual entre sódio e alvo (mEq/L)
 * @returns {number} Taxa de correção máxima (mEq/L)
 */
function calculateMaxCorrectionRate(currentDifference) {
  const MAX_CORRECTION = 10; // 10 mEq/L em 24h
  return Math.min(MAX_CORRECTION, Math.abs(currentDifference));
}

/**
 * Calcula a porcentagem de correção recomendada
 * @param {number} currentDifference - Diferença atual entre sódio e alvo (mEq/L)
 * @returns {number} Porcentagem de correção (0-100)
 */
function calculateCorrectionPercentage(currentDifference) {
  const maxCorrection = calculateMaxCorrectionRate(currentDifference);
  return Math.min((maxCorrection / Math.abs(currentDifference)) * 100, 100);
}
return { calculateMaxCorrectionRate: calculateMaxCorrectionRate, calculateCorrectionPercentage: calculateCorrectionPercentage };
})();

var __mod_calcio_corrigido_7 = (function () {
/**
 * Cálcio sérico corrigido pela albumina.
 *
 * Ca corrigido (mg/dL) = Ca total (mg/dL) + 0,8 × (4,0 − albumina em g/dL)
 *
 * Classificação: < 8,0 mg/dL hipocalcemia; 8,0–10,5 normal;
 * > 11,0 hipercalcemia (limiar do INCA para hipercalcemia).
 *
 * Aviso clínico: os fatores de correção pela albumina não são confiáveis
 * para diagnóstico de hipo/hipercalcemia em pacientes críticos; o único
 * método confiável é o cálcio iônico com eletrodos ion-seletivos
 * (Slomp, Crit Care Med 2003; Byrnes, Am J Surg 2005; The ICU Book,
 * cap. Cálcio e Fósforo).
 */
function calculateCalcioCorrigido(calcioTotal, albumina) {
  if (
    typeof calcioTotal !== 'number' || !Number.isFinite(calcioTotal) || calcioTotal < 0 ||
    typeof albumina !== 'number' || !Number.isFinite(albumina) || albumina < 0
  ) {
    return null;
  }
  return calcioTotal + 0.8 * (4.0 - albumina);
}

function classifyCalcioCorrigido(calcioCorrigido) {
  if (typeof calcioCorrigido !== 'number' || !Number.isFinite(calcioCorrigido)) {
    return null;
  }
  if (calcioCorrigido < 8.0) {
    return {
      rotulo: 'Hipocalcemia (cálcio corrigido < 8,0 mg/dL)',
      classificacao: 'hipocalcemia',
    };
  }
  if (calcioCorrigido > 11.0) {
    return {
      rotulo: 'Hipercalcemia (cálcio corrigido > 11,0 mg/dL)',
      classificacao: 'hipercalcemia',
    };
  }
  return {
    rotulo: 'Cálcio corrigido dentro da faixa usual (8,0–11,0 mg/dL)',
    classificacao: 'normal',
  };
}

function formatCalcioCorrigidoResult(calcioTotal, albumina) {
  const corrigido = calculateCalcioCorrigido(calcioTotal, albumina);
  if (corrigido === null) {
    return 'Informe cálcio total (mg/dL) e albumina (g/dL) válidos.';
  }
  const rounded = Math.round(corrigido * 100) / 100;
  const classification = classifyCalcioCorrigido(corrigido);
  return `Cálcio corrigido: <strong>${rounded.toFixed(2).replace('.', ',')} mg/dL</strong> — ${classification.rotulo}.`;
}
return { calculateCalcioCorrigido: calculateCalcioCorrigido, classifyCalcioCorrigido: classifyCalcioCorrigido, formatCalcioCorrigidoResult: formatCalcioCorrigidoResult };
})();

var __mod_index_8 = (function (calculateDeficitPotassio, faixaAlternativa70kg, formatDeficitPotassioResult, classifyGravidadeHipocalemia, formatGravidadeResult, limiteVelocidadePorPeso, validarAporteTotalK, formatLimitesSeguranca, selecionarSal, calculateFosfatoPotassio, formatFosfatoResult, calculateTBWPercentage, calculateWaterDeficit, calculateMaxCorrectionRate, calculateCorrectionPercentage, calculateCalcioCorrigido, classifyCalcioCorrigido, formatCalcioCorrigidoResult) {
// Exporta todas as funções de cálculo dos distúrbios hidroeletrolíticos
// Potássio



// Fosfato

// Sódio / água livre



// Cálcio
return { calculateDeficitPotassio: calculateDeficitPotassio, faixaAlternativa70kg: faixaAlternativa70kg, formatDeficitPotassioResult: formatDeficitPotassioResult, classifyGravidadeHipocalemia: classifyGravidadeHipocalemia, formatGravidadeResult: formatGravidadeResult, limiteVelocidadePorPeso: limiteVelocidadePorPeso, validarAporteTotalK: validarAporteTotalK, formatLimitesSeguranca: formatLimitesSeguranca, selecionarSal: selecionarSal, calculateFosfatoPotassio: calculateFosfatoPotassio, formatFosfatoResult: formatFosfatoResult, calculateTBWPercentage: calculateTBWPercentage, calculateWaterDeficit: calculateWaterDeficit, calculateMaxCorrectionRate: calculateMaxCorrectionRate, calculateCorrectionPercentage: calculateCorrectionPercentage, calculateCalcioCorrigido: calculateCalcioCorrigido, classifyCalcioCorrigido: classifyCalcioCorrigido, formatCalcioCorrigidoResult: formatCalcioCorrigidoResult };
})(__mod_deficit_potassio_0.calculateDeficitPotassio, __mod_deficit_potassio_0.faixaAlternativa70kg, __mod_deficit_potassio_0.formatDeficitPotassioResult, __mod_gravidade_hipocalemia_1.classifyGravidadeHipocalemia, __mod_gravidade_hipocalemia_1.formatGravidadeResult, __mod_limites_infusao_k_2.limiteVelocidadePorPeso, __mod_limites_infusao_k_2.validarAporteTotalK, __mod_limites_infusao_k_2.formatLimitesSeguranca, __mod_fosfato_potassio_3.selecionarSal, __mod_fosfato_potassio_3.calculateFosfatoPotassio, __mod_fosfato_potassio_3.formatFosfatoResult, __mod_tbw_percentage_4.calculateTBWPercentage, __mod_water_deficit_5.calculateWaterDeficit, __mod_correction_rate_6.calculateMaxCorrectionRate, __mod_correction_rate_6.calculateCorrectionPercentage, __mod_calcio_corrigido_7.calculateCalcioCorrigido, __mod_calcio_corrigido_7.classifyCalcioCorrigido, __mod_calcio_corrigido_7.formatCalcioCorrigidoResult);

var __mod_state_9 = (function (calculations) {
/**
 * Gerenciador de estado para a ferramenta de distúrbios hidroeletrolíticos
 * Mantém inputs e outputs sincronizados e recalcula automaticamente
 */


const state = {
  activeTab: 'potassio',
  inputs: {
    // Potássio
    'k-peso': 70,
    'k-potassio': 3.0,
    'k-urgencia': 'nao',
    // Fosfato
    'f-fosfato': 1.2,
    'f-peso': 70,
    'f-potassio-plasma': 3.1,
    'f-kcl-dia': 0,
    // Sódio
    's-sodio': 140,
    's-sodio-alvo': 140,
    's-peso': 70,
    's-idade': 40,
    's-sexo': 'male',
    // Cálcio
    'c-calcio-total': 7.5,
    'c-albumina': 2.5,
  },
  outputs: {
    deficit: null,
    faixa: null,
    gravidade: null,
    fosfato: null,
    sal: null,
    aporteTotal: null,
    agua: null,
    calcioCorrigido: null,
  },
};

function toNumber(value) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function updateInput(name, value) {
  state.inputs[name] = value;
}

function calcularPotassio() {
  const peso = toNumber(state.inputs['k-peso']);
  const potassio = toNumber(state.inputs['k-potassio']);
  state.outputs.deficit = calculations.calculateDeficitPotassio(potassio, peso);
  state.outputs.faixa = calculations.faixaAlternativa70kg(potassio);
  state.outputs.gravidade = calculations.classifyGravidadeHipocalemia(
    potassio,
    state.inputs['k-urgencia'] === 'sim'
  );
}

function calcularFosfato() {
  const peso = toNumber(state.inputs['f-peso']);
  const fosfato = toNumber(state.inputs['f-fosfato']);
  const potassioPlasma = toNumber(state.inputs['f-potassio-plasma']);
  const kclDia = toNumber(state.inputs['f-kcl-dia']);
  state.outputs.fosfato = calculations.calculateFosfatoPotassio(fosfato, peso);
  state.outputs.sal = calculations.selecionarSal(potassioPlasma);
  const kFosfato = state.outputs.fosfato ? state.outputs.fosfato.potassiumMEq : 0;
  state.outputs.aporteTotal = {
    total: (kclDia || 0) + kFosfato,
    limite: calculations.limiteVelocidadePorPeso(peso),
  };
}

function calcularSodio() {
  const sodio = toNumber(state.inputs['s-sodio']);
  const alvo = toNumber(state.inputs['s-sodio-alvo']);
  const peso = toNumber(state.inputs['s-peso']);
  const idade = toNumber(state.inputs['s-idade']);
  const sexo = state.inputs['s-sexo'];
  if (sodio === null || alvo === null || peso === null || !alvo) {
    state.outputs.agua = null;
    return;
  }
  const tbw = calculations.calculateTBWPercentage(idade || 0, sexo);
  const deficitLiters = calculations.calculateWaterDeficit(sodio, alvo, peso, tbw);
  const difference = sodio - alvo;
  state.outputs.agua = {
    deficitLiters,
    deficitML: deficitLiters * 1000,
    hipernatremia: difference > 0,
    maxCorrectionRate: calculations.calculateMaxCorrectionRate(difference),
    correctionPercentage: calculations.calculateCorrectionPercentage(difference),
    sodio,
    alvo,
  };
}

function calcularCalcio() {
  const calcioTotal = toNumber(state.inputs['c-calcio-total']);
  const albumina = toNumber(state.inputs['c-albumina']);
  state.outputs.calcioCorrigido = calculations.calculateCalcioCorrigido(calcioTotal, albumina);
}

function openTab(tabName) {
  state.activeTab = tabName;
}

calcularPotassio();
calcularFosfato();
calcularSodio();
calcularCalcio();
return { updateInput: updateInput, calcularPotassio: calcularPotassio, calcularFosfato: calcularFosfato, calcularSodio: calcularSodio, calcularCalcio: calcularCalcio, openTab: openTab, state: state };
})(__mod_index_8);

var __mod_feedback_10 = (function () {
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

var __mod_ui_11 = (function (state, updateInput, openTab, calcularPotassio, calcularFosfato, calcularSodio, calcularCalcio, calculations, renderFeedback) {
/**
 * Manipulação de DOM e eventos para a ferramenta de distúrbios hidroeletrolíticos
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */




function updateDOM() {
  for (const [id, value] of Object.entries(state.inputs)) {
    const element = document.getElementById(id);
    if (element) element.value = value;
  }

  document.querySelectorAll('.tab-button').forEach((button) => {
    const tabName = button.getAttribute('data-tab');
    if (tabName === state.activeTab) {
      button.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    } else {
      button.classList.remove('active');
      document.getElementById(tabName).classList.remove('active');
    }
  });

  // Potássio
  document.getElementById('k-deficit-result').innerHTML =
    calculations.formatDeficitPotassioResult(state.outputs.deficit);
  const faixa = state.outputs.faixa;
  document.getElementById('k-faixa-result').textContent = faixa
    ? `Faixa alternativa de estimativa (adulto de 70 kg): ${faixa.min}–${faixa.max} mEq.`
    : '';
  document.getElementById('k-gravidade-result').innerHTML =
    calculations.formatGravidadeResult(state.outputs.gravidade);
  document.getElementById('k-limites-result').textContent =
    calculations.formatLimitesSeguranca(toNumber(state.inputs['k-peso']));

  // Fosfato
  document.getElementById('f-fosfato-result').innerHTML =
    calculations.formatFosfatoResult(state.outputs.fosfato);
  const sal = state.outputs.sal;
  document.getElementById('f-sal-result').textContent = sal
    ? `Sal selecionado para o K plasmático informado: ${sal} (fosfato de potássio se K < 4 mEq/L; fosfato de sódio se K ≥ 4 mEq/L).`
    : 'Informe o K plasmático para selecionar o sal.';
  const aporte = state.outputs.aporteTotal;
  document.getElementById('f-aporte-result').textContent = aporte
    ? `Aporte total de K do dia (KCl + K do fosfato): ${Math.round(aporte.total)} mEq. Limite de velocidade periférico ajustado ao peso: ${aporte.limite ? aporte.limite.toFixed(0) : '?'} mEq/h.`
    : '';

  // Sódio
  const agua = state.outputs.agua;
  const sResult = document.getElementById('s-result');
  if (!agua) {
    sResult.innerHTML = 'Informe sódio atual, alvo e peso válidos.';
  } else {
    const litros = Math.round(agua.deficitLiters * 100) / 100;
    const mL = Math.round(agua.deficitML);
    if (agua.hipernatremia) {
      sResult.innerHTML =
        `Déficit de água livre: <strong>${litros} L (${mL} mL)</strong> (hipernatremia — Na⁺ ${agua.sodio} > ${agua.alvo}). ` +
        `Volume a repor: ${Math.abs(mL)} mL de água livre (solução glicosada 5%). ⚠️ Correção máxima: reduzir até ${agua.maxCorrectionRate} mEq/L nas primeiras 24 h (${agua.correctionPercentage.toFixed(1)}% do excesso total).`;
    } else if (agua.sodio < agua.alvo) {
      sResult.innerHTML =
        `Excesso de água livre: <strong>hiponatremia (Na⁺ ${agua.sodio} < ${agua.alvo})</strong>. ` +
        `⚠️ Correção máxima: até ${agua.maxCorrectionRate} mEq/L nas primeiras 24 h (${agua.correctionPercentage.toFixed(1)}% do déficit total).`;
    } else {
      sResult.innerHTML = `Sódio dentro do alvo (Na⁺ = ${agua.sodio} mEq/L). Nenhum déficit.`;
    }
  }

  // Cálcio
  document.getElementById('c-result').innerHTML =
    calculations.formatCalcioCorrigidoResult(
      toNumber(state.inputs['c-calcio-total']),
      toNumber(state.inputs['c-albumina'])
    );
}

const actions = {
  openTab: (e) => {
    openTab(e.currentTarget.getAttribute('data-tab'));
    updateDOM();
  },
  calcularPotassio: () => {
    calcularPotassio();
    updateDOM();
  },
  calcularFosfato: () => {
    calcularFosfato();
    updateDOM();
  },
  calcularSodio: () => {
    calcularSodio();
    updateDOM();
  },
  calcularCalcio: () => {
    calcularCalcio();
    updateDOM();
  },
};



document.addEventListener('DOMContentLoaded', () => {
  renderFeedback('Distúrbios hidroeletrolíticos');
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
      const recalc = () => {
        updateInput(id, input.value);
        calcularPotassio();
        calcularFosfato();
        calcularSodio();
        calcularCalcio();
        updateDOM();
      };
      input.addEventListener('input', recalc);
      input.addEventListener('change', recalc);
    }
  });
  updateDOM();
});
return { actions: actions };
})(__mod_state_9.state, __mod_state_9.updateInput, __mod_state_9.openTab, __mod_state_9.calcularPotassio, __mod_state_9.calcularFosfato, __mod_state_9.calcularSodio, __mod_state_9.calcularCalcio, __mod_index_8, __mod_feedback_10.renderFeedback);