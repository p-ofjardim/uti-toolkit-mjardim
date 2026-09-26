/**
 * Calcula CROP Index
 * @param {number} cdin - Compliance dinâmica (mL/cmH₂O)
 * @param {number} pimax - PImax (cmH₂O)
 * @param {number} pao2 - PaO₂ (mmHg)
 * @param {number} paco2 - PaCO₂ (mmHg)
 * @param {number} fr - Frequência respiratória (irpm)
 * @returns {Object} Objeto com cropIndex e interpretation
 */
export function calculateCROP(cdin, pimax, pao2, paco2, fr) {
  if (isNaN(cdin) || isNaN(pimax) || isNaN(pao2) || isNaN(paco2) || isNaN(fr) || paco2 <= 0 || fr <= 0) {
    return { cropIndex: null, interpretation: '' };
  }
  
  const crop = (cdin * pimax * (pao2 / paco2)) / fr;
  let interpretation = '';
  if (crop > 15) interpretation = ' ✅ (Sucesso provável)';
  else if (crop > 13) interpretation = ' ⚠️ (Inconclusivo)';
  else interpretation = ' ❌ (Falha provável)';
  
  return { cropIndex: crop, interpretation };
}

/**
 * Formata o resultado do CROP Index
 * @param {Object} result - Objeto com cropIndex e interpretation
 * @returns {string} Resultado formatado
 */
export function formatCROPResult(result) {
  if (result.cropIndex === null) return '❌ Preencha todos os campos';
  return `<span class="result-label">CROP Index:</span> <span class="result-value">${result.cropIndex.toFixed(1)}</span>${result.interpretation}`;
}
