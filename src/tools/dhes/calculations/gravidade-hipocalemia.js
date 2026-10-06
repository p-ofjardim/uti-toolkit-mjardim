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
export function classifyGravidadeHipocalemia(potassium, urgente) {
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

export function formatGravidadeResult(classification) {
  if (!classification) return 'Informe o potássio sérico (mEq/L).';
  return `<strong>${classification.rotulo}</strong><br>${classification.conduta}`;
}
