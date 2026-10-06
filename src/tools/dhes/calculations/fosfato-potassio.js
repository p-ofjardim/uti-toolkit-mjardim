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

export function selecionarSal(potassium) {
  if (typeof potassium !== 'number' || !Number.isFinite(potassium)) return null;
  return potassium < 4
    ? 'fosfato de potássio'
    : 'fosfato de sódio';
}

export function calculateFosfatoPotassio(phosphorus, weightKg) {
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

export function formatFosfatoResult(result) {
  if (!result) {
    return 'Fosfato indicado apenas se < 1,0 mg/dL ou hipofosfatemia sintomática. Tabela válida para 40–120 kg e fosfatemia até 2,5 mg/dL.';
  }
  return `Dose: <strong>${result.doseMmol} mmol</strong> de PO₄ → ${result.volumeMl} mL da solução, ` +
    `com <strong>${result.potassiumMEq} mEq de K</strong> concomitante, em ${result.infusionHours} h.`;
}
