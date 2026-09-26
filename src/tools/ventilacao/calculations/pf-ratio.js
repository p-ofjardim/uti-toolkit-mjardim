/**
 * Calcula P/F Ratio (PaO₂ / FiO₂)
 * @param {number} pao2 - PaO₂ (mmHg)
 * @param {number} fio2 - FiO₂ (0-1)
 * @returns {Object} Objeto com pfRatio e interpretation
 */
export function calculatePF(pao2, fio2) {
  if (isNaN(pao2) || isNaN(fio2) || fio2 <= 0) return { pfRatio: null, interpretation: '' };
  
  const pf = pao2 / fio2;
  let interpretation = '';
  if (pf > 400) interpretation = ' ✅ (Normal)';
  else if (pf >= 200) interpretation = ' ⚠️ (SARA leve)';
  else if (pf >= 100) interpretation = ' ❌ (SARA moderada)';
  else interpretation = ' ❌ (SARA grave)';
  
  return { pfRatio: pf, interpretation };
}

/**
 * Formata o resultado do P/F Ratio
 * @param {Object} result - Objeto com pfRatio e interpretation
 * @returns {string} Resultado formatado
 */
export function formatPFResult(result) {
  if (result.pfRatio === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">P/F Ratio:</span> <span class="result-value">${result.pfRatio.toFixed(0)}</span>${result.interpretation}`;
}
