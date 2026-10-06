/**
 * Calcula a taxa de correção máxima recomendada (8-10 mEq/L em 24h)
 * @param {number} currentDifference - Diferença atual entre sódio e alvo (mEq/L)
 * @returns {number} Taxa de correção máxima (mEq/L)
 */
export function calculateMaxCorrectionRate(currentDifference) {
  const MAX_CORRECTION = 10; // 10 mEq/L em 24h
  return Math.min(MAX_CORRECTION, Math.abs(currentDifference));
}

/**
 * Calcula a porcentagem de correção recomendada
 * @param {number} currentDifference - Diferença atual entre sódio e alvo (mEq/L)
 * @returns {number} Porcentagem de correção (0-100)
 */
export function calculateCorrectionPercentage(currentDifference) {
  const maxCorrection = calculateMaxCorrectionRate(currentDifference);
  return Math.min((maxCorrection / Math.abs(currentDifference)) * 100, 100);
}
