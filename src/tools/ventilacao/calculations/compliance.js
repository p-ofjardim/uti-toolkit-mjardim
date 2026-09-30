/**
 * Calcula Complacência Estática (C = VT / (Pplat - PEEP))
 * @param {number} vt - Volume corrente (mL)
 * @param {number} pplat - Pressão de platô (cmH₂O)
 * @param {number} peep - PEEP (cmH₂O)
 * @returns {number|null} Complacência (mL/cmH₂O) ou null se inválido
 */
export function calculateCompliance(vt, pplat, peep) {
  if (isNaN(vt) || isNaN(pplat) || isNaN(peep)) return null;
  
  const deltaP = pplat - peep;
  if (deltaP <= 0) return null; // Pplat deve ser > PEEP
  
  return vt / deltaP;
}

/**
 * Formata o resultado da Complacência
 * @param {number|null} compliance - Complacência (mL/cmH₂O)
 * @returns {string} Resultado formatado
 */
export function formatComplianceResult(compliance) {
  if (compliance === null) return '❌ Pplat deve ser > PEEP';
  if (compliance === undefined) return '❌ Preencha todos os campos';
  return `<span class="result-label">Complacência:</span> <span class="result-value">${compliance.toFixed(1)} mL/cmH₂O</span>`;
}
