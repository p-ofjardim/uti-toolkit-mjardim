/**
 * Calcula Ajuste de FR (FR nova = FR × (PaCO₂ atual / PaCO₂ desejada))
 * @param {number} fr - FR atual (irpm)
 * @param {number} paco2 - PaCO₂ atual (mmHg)
 * @param {number} paco2d - PaCO₂ desejada (mmHg)
 * @returns {number|null} FR ajustada (irpm) ou null se inválido
 */
export function calculateAjusteFR(fr, paco2, paco2d) {
  if (isNaN(fr) || isNaN(paco2) || isNaN(paco2d) || paco2d <= 0) return null;
  return fr * (paco2 / paco2d);
}

/**
 * Formata o resultado do Ajuste de FR
 * @param {number|null} frNova - FR ajustada (irpm)
 * @returns {string} Resultado formatado
 */
export function formatAjusteFRResult(frNova) {
  if (frNova === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">FR Ajustada:</span> <span class="result-value">${frNova.toFixed(1)} irpm</span>`;
}
