/**
 * Calcula VE Espontâneo (VE = VT × FR / 1000)
 * @param {number} vt - Volume corrente (mL)
 * @param {number} fr - Frequência respiratória (irpm)
 * @returns {number|null} VE espontâneo (L/min) ou null se inválido
 */
export function calculateVEEspontaneo(vt, fr) {
  if (isNaN(vt) || isNaN(fr)) return null;
  return (vt * fr) / 1000;
}

/**
 * Formata o resultado do VE Espontâneo
 * @param {number|null} ve - VE espontâneo (L/min)
 * @returns {string} Resultado formatado
 */
export function formatVEEspontaneoResult(ve) {
  if (ve === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">VE Espontâneo:</span> <span class="result-value">${ve.toFixed(1)} L/min</span>`;
}
