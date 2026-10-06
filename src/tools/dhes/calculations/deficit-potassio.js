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
export function baseDeficit70kg(potassium) {
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
export function calculateDeficitPotassio(potassium, weightKg) {
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
export function faixaAlternativa70kg(potassium) {
  if (typeof potassium !== 'number' || !Number.isFinite(potassium)) return null;
  if (potassium >= 3.0 && potassium <= 3.5) return { min: 100, max: 200 };
  if (potassium >= 2.5 && potassium < 3.0) return { min: 200, max: 400 };
  if (potassium >= 2.0 && potassium < 2.5) return { min: 400, max: 1000 };
  return null;
}

export function formatDeficitPotassioResult(deficit) {
  if (deficit === null || deficit === undefined) {
    return 'Informe potássio sérico (mEq/L) e peso (kg) válidos.';
  }
  const rounded = Math.round(deficit);
  if (deficit <= 0) return 'Déficit estimado: desprezível (K sérico ≥ 4,0 mEq/L).';
  return `Déficit estimado: <strong>${rounded} mEq</strong> de potássio para repor até ~4,0 mEq/L.`;
}
