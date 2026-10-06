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
export function calculateCalcioCorrigido(calcioTotal, albumina) {
  if (
    typeof calcioTotal !== 'number' || !Number.isFinite(calcioTotal) || calcioTotal < 0 ||
    typeof albumina !== 'number' || !Number.isFinite(albumina) || albumina < 0
  ) {
    return null;
  }
  return calcioTotal + 0.8 * (4.0 - albumina);
}

export function classifyCalcioCorrigido(calcioCorrigido) {
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

export function formatCalcioCorrigidoResult(calcioTotal, albumina) {
  const corrigido = calculateCalcioCorrigido(calcioTotal, albumina);
  if (corrigido === null) {
    return 'Informe cálcio total (mg/dL) e albumina (g/dL) válidos.';
  }
  const rounded = Math.round(corrigido * 100) / 100;
  const classification = classifyCalcioCorrigido(corrigido);
  return `Cálcio corrigido: <strong>${rounded.toFixed(2).replace('.', ',')} mg/dL</strong> — ${classification.rotulo}.`;
}
