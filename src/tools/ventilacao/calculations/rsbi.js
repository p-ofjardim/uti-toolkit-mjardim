/**
 * Calcula RSBI (Rapid Shallow Breathing Index)
 * @param {number} fr - Frequência respiratória (irpm)
 * @param {number} vt - Volume corrente (mL)
 * @returns {Object} Objeto com rsbi e interpretation
 */
export function calculateRSBI(fr, vt) {
  if (isNaN(fr) || isNaN(vt) || vt <= 0) return { rsbi: null, interpretation: '' };
  
  const rsbi = fr / (vt / 1000);
  let interpretation = '';
  if (rsbi < 105) interpretation = ' ✅ (Sucesso provável)';
  else interpretation = ' ❌ (Falha provável)';
  
  return { rsbi, interpretation };
}

/**
 * Formata o resultado do RSBI
 * @param {Object} result - Objeto com rsbi e interpretation
 * @returns {string} Resultado formatado
 */
export function formatRSBIResult(result) {
  if (result.rsbi === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">RSBI:</span> <span class="result-value">${result.rsbi.toFixed(1)} respirações/min/L</span>${result.interpretation}`;
}
