/**
 * Calcula VT Espontâneo (VT = (VE × 1000) / FR)
 * @param {number} ve - Volume minuto (L/min)
 * @param {number} fr - Frequência respiratória (irpm)
 * @returns {number|null} VT espontâneo (mL) ou null se inválido
 */
export function calculateVTEspontaneo(ve, fr) {
  if (isNaN(ve) || isNaN(fr) || fr <= 0) return null;
  return (ve * 1000) / fr;
}

/**
 * Formata o resultado do VT Espontâneo
 * @param {number|null} vt - VT espontâneo (mL)
 * @returns {string} Resultado formatado
 */
export function formatVTEspontaneoResult(vt) {
  if (vt === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">VT Espontâneo:</span> <span class="result-value">${vt.toFixed(0)} mL</span>`;
}
