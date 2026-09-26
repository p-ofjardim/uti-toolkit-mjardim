/**
 * Calcula ΔHCO₃ Esperado (ΔHCO₃ = 0.35 * ΔPaCO₂)
 * @param {number} deltaPaco2 - ΔPaCO₂ (mmHg)
 * @returns {number|null} ΔHCO₃ (mEq/L) ou null se inválido
 */
export function calculateHCO3Esperado(deltaPaco2) {
  if (isNaN(deltaPaco2)) return null;
  return 0.35 * deltaPaco2;
}

/**
 * Formata o resultado do ΔHCO₃ Esperado
 * @param {number|null} hco3 - ΔHCO₃ (mEq/L)
 * @returns {string} Resultado formatado
 */
export function formatHCO3EsperadoResult(hco3) {
  if (hco3 === null) return '❌ Preencha o campo';
  return `<span class="result-label">ΔHCO₃:</span> <span class="result-value">+${hco3.toFixed(1)} mEq/L</span>`;
}
