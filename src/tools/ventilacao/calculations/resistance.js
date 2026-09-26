/**
 * Calcula Resistência das Vias Aéreas (R = (Ppeak - Pplat) / Fluxo)
 * @param {number} ppeak - Pico de pressão (cmH₂O)
 * @param {number} pplat - Pressão de platô (cmH₂O)
 * @param {number} fluxo - Fluxo (L/s)
 * @returns {number|null} Resistência (cmH₂O/L/s) ou null se inválido
 */
export function calculateResistance(ppeak, pplat, fluxo) {
  if (isNaN(ppeak) || isNaN(pplat) || isNaN(fluxo)) return null;
  
  const deltaP = ppeak - pplat;
  if (deltaP < 0) return null; // Ppeak deve ser >= Pplat
  if (fluxo <= 0) return null; // Fluxo deve ser positivo
  
  return deltaP / fluxo;
}

/**
 * Formata o resultado da Resistência
 * @param {number|null} resistance - Resistência (cmH₂O/L/s)
 * @returns {string} Resultado formatado
 */
export function formatResistanceResult(resistance) {
  if (resistance === null) return '❌ Ppeak deve ser ≥ Pplat e Fluxo > 0';
  if (resistance === undefined) return '❌ Preencha todos os campos';
  return `<span class="result-label">Resistência:</span> <span class="result-value">${resistance.toFixed(1)} cmH₂O/L/s</span>`;
}
