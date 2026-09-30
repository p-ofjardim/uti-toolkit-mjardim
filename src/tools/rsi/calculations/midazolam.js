/**
 * Calcula dose de Midazolam
 * @param {number} peso - Peso do paciente (kg)
 * @param {number} doseMgKg - Dose (mg/kg)
 * @param {number} concentracao - Concentração (mg/mL)
 * @returns {Object} Objeto com doseTotal e volume
 */
export function calculateMidazolam(peso, doseMgKg = 0.1, concentracao = 1) {
  const dose = doseMgKg * peso;
  const volume = dose / concentracao;
  return { doseTotal: dose, volume };
}
