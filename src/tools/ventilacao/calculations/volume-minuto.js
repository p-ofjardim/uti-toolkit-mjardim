/**
 * Calcula Volume Minuto (VE = VT * FR / 1000)
 * @param {number} vt - Volume corrente (mL)
 * @param {number} fr - Frequência respiratória (irpm)
 * @returns {number} Volume minuto (L/min)
 */
export function calculateVE(vt, fr) {
  if (isNaN(vt) || isNaN(fr)) return null;
  return (vt * fr) / 1000;
}

/**
 * Formata o resultado do Volume Minuto
 * @param {number} ve - Volume minuto (L/min)
 * @returns {string} Resultado formatado
 */
export function formatVEResult(ve) {
  if (ve === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">Volume Minuto:</span> <span class="result-value">${ve.toFixed(1)} L/min</span>`;
}
