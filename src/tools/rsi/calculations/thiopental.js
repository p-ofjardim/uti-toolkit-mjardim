/**
 * Calcula dose de Tiopental
 * @param {number} peso - Peso do paciente (kg)
 * @param {number} doseMgKg - Dose (mg/kg)
 * @param {number} concentracao - Concentração (mg/mL)
 * @returns {Object} Objeto com doseTotal e volume
 */
export function calculateThiopental(peso, doseMgKg = 3, concentracao = 25) {
  const dose = doseMgKg * peso;
  const volume = dose / concentracao;
  return { doseTotal: dose, volume };
}
