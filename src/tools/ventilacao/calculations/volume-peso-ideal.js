/**
 * Calcula Volume Corrente por Peso Ideal (VT = 6-8 mL/kg)
 * @param {number} pesoIdeal - Peso ideal (kg)
 * @returns {Object} Objeto com min e max VT
 */
export function calculateVolumePesoIdeal(pesoIdeal) {
  if (isNaN(pesoIdeal)) return { min: null, max: null };
  
  const min = 6 * pesoIdeal;
  const max = 8 * pesoIdeal;
  
  return { min, max };
}

/**
 * Formata o resultado do Volume por Peso Ideal
 * @param {Object} result - Objeto com min e max VT
 * @returns {string} Resultado formatado
 */
export function formatVolumePesoIdealResult(result) {
  if (result.min === null) return '❌ Preencha o campo';
  return `<span class="result-label">Volume Corrente:</span> <span class="result-value">${result.min.toFixed(0)}-${result.max.toFixed(0)} mL</span>`;
}
