/**
 * Calcula a porcentagem de TBW (Total Body Water) com base em idade e sexo
 * @param {number} age - Idade em anos
 * @param {string} gender - Sexo ('male' ou 'female')
 * @returns {number} Porcentagem de TBW (0.45 a 0.6)
 */
export function calculateTBWPercentage(age, gender) {
  if (age >= 65) {
    // Idoso
    return gender === 'male' ? 0.5 : 0.45;
  } else {
    // Adulto
    return gender === 'male' ? 0.6 : 0.5;
  }
}
