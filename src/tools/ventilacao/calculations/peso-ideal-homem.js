/**
 * Calcula Peso Ideal para Homem
 * @param {number} altura - Altura (cm)
 * @returns {number|null} Peso ideal (kg) ou null se inválido
 */
export function calculatePesoIdealHomem(altura) {
  if (isNaN(altura)) return null;
  return 50 + 0.91 * (altura - 152.4);
}

/**
 * Formata o resultado do Peso Ideal (Homem)
 * @param {number|null} pesoIdeal - Peso ideal (kg)
 * @returns {string} Resultado formatado
 */
export function formatPesoIdealHomemResult(pesoIdeal) {
  if (pesoIdeal === null) return '❌ Preencha o campo';
  return `<span class="result-label">Peso Ideal:</span> <span class="result-value">${pesoIdeal.toFixed(1)} kg</span>`;
}
