/**
 * Calcula Peso Ideal para Mulher
 * @param {number} altura - Altura (cm)
 * @returns {number|null} Peso ideal (kg) ou null se inválido
 */
export function calculatePesoIdealMulher(altura) {
  if (isNaN(altura)) return null;
  return 45.5 + 0.91 * (altura - 152.4);
}

/**
 * Formata o resultado do Peso Ideal (Mulher)
 * @param {number|null} pesoIdeal - Peso ideal (kg)
 * @returns {string} Resultado formatado
 */
export function formatPesoIdealMulherResult(pesoIdeal) {
  if (pesoIdeal === null) return '❌ Preencha o campo';
  return `<span class="result-label">Peso Ideal:</span> <span class="result-value">${pesoIdeal.toFixed(1)} kg</span>`;
}
