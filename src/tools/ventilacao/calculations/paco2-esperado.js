/**
 * Calcula PaCO₂ Esperado (PaCO₂ = 1.5 * HCO₃ + 8)
 * @param {number} hco3 - HCO₃ (mEq/L)
 * @returns {number|null} PaCO₂ esperado (mmHg) ou null se inválido
 */
export function calculatePaCO2Esperado(hco3) {
  if (isNaN(hco3)) return null;
  return 1.5 * hco3 + 8;
}

/**
 * Formata o resultado do PaCO₂ Esperado
 * @param {number|null} paco2 - PaCO₂ esperado (mmHg)
 * @returns {string} Resultado formatado
 */
export function formatPaCO2EsperadoResult(paco2) {
  if (paco2 === null) return '❌ Preencha o campo';
  return `<span class="result-label">PaCO₂ Esperado:</span> <span class="result-value">${paco2.toFixed(0)} ± 2 mmHg</span>`;
}
