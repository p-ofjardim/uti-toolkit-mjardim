/**
 * Calcula Driving Pressure (ΔP = Pplat - PEEP)
 * @param {number} pplat - Pressão de platô (cmH₂O)
 * @param {number} peep - PEEP (cmH₂O)
 * @returns {Object} Objeto com drivingPressure e interpretation
 */
export function calculateDrivingPressure(pplat, peep) {
  if (isNaN(pplat) || isNaN(peep)) return { drivingPressure: null, interpretation: '' };
  
  const dp = pplat - peep;
  let interpretation = '';
  if (dp < 15) interpretation = ' ✅ (Meta: < 15 cmH₂O)';
  else if (dp < 20) interpretation = ' ⚠️ (Elevado)';
  else interpretation = ' ❌ (Muito elevado)';
  
  return { drivingPressure: dp, interpretation };
}

/**
 * Formata o resultado do Driving Pressure
 * @param {Object} result - Objeto com drivingPressure e interpretation
 * @returns {string} Resultado formatado
 */
export function formatDrivingPressureResult(result) {
  if (result.drivingPressure === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">Driving Pressure:</span> <span class="result-value">${result.drivingPressure.toFixed(1)} cmH₂O</span>${result.interpretation}`;
}
