/**
 * Calcula Relação I:E (I:E = 1 : (Ttotal - Tinsp) / Tinsp)
 * @param {number} tinsp - Tempo inspiratório (segundos)
 * @param {number} fr - Frequência respiratória (irpm)
 * @returns {number|null} Relação I:E ou null se inválido
 */
export function calculateIE(tinsp, fr) {
  if (isNaN(tinsp) || isNaN(fr)) return null;
  
  const ttotal = 60 / fr; // Ttotal em segundos
  if (ttotal <= tinsp) return null; // Tinsp não pode ser >= Ttotal
  
  // Fórmula: I:E = 1 : Texp/Tinsp
  return (ttotal - tinsp) / tinsp;
}

/**
 * Formata o resultado da Relação I:E
 * @param {number|null} ie - Relação I:E
 * @returns {string} Resultado formatado
 */
export function formatIEResult(ie) {
  if (ie === null) return '❌ Tinsp não pode ser ≥ Ttotal';
  if (ie === undefined) return '❌ Preencha todos os campos';
  return `<span class="result-label">Relação I:E:</span> <span class="result-value">1:${ie.toFixed(1)}</span>`;
}
