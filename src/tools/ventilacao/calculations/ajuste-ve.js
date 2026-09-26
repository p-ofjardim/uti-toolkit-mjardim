/**
 * Calcula Ajuste de VE (VE novo = VE × (PaCO₂ atual / PaCO₂ desejada))
 * @param {number} ve - VE atual (L/min)
 * @param {number} paco2 - PaCO₂ atual (mmHg)
 * @param {number} paco2d - PaCO₂ desejada (mmHg)
 * @returns {number|null} VE ajustado (L/min) ou null se inválido
 */
export function calculateAjusteVE(ve, paco2, paco2d) {
  if (isNaN(ve) || isNaN(paco2) || isNaN(paco2d) || paco2d <= 0) return null;
  return ve * (paco2 / paco2d);
}

/**
 * Formata o resultado do Ajuste de VE
 * @param {number|null} veNovo - VE ajustado (L/min)
 * @returns {string} Resultado formatado
 */
export function formatAjusteVEResult(veNovo) {
  if (veNovo === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">VE Ajustado:</span> <span class="result-value">${veNovo.toFixed(1)} L/min</span>`;
}
