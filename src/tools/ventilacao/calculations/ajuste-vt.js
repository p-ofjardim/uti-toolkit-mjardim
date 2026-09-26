/**
 * Calcula Ajuste de VT (VT novo = VT × (PaCO₂ atual / PaCO₂ desejada))
 * @param {number} vt - VT atual (mL)
 * @param {number} paco2d - PaCO₂ desejada (mmHg)
 * @param {number} paco2 - PaCO₂ atual (mmHg)
 * @returns {number|null} VT ajustado (mL) ou null se inválido
 */
export function calculateAjusteVT(vt, paco2d, paco2) {
  if (isNaN(vt) || isNaN(paco2d) || isNaN(paco2) || paco2 <= 0) return null;
  return vt * (paco2 / paco2d);
}

/**
 * Formata o resultado do Ajuste de VT
 * @param {number|null} vtNovo - VT ajustado (mL)
 * @returns {string} Resultado formatado
 */
export function formatAjusteVTResult(vtNovo) {
  if (vtNovo === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">VT Ajustado:</span> <span class="result-value">${vtNovo.toFixed(0)} mL</span>`;
}
