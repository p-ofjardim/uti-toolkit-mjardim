/**
 * Calcula dose de Rocurônio
 * @param {number} peso - Peso do paciente (kg)
 * @param {number} doseMgKg - Dose (mg/kg)
 * @param {number} concentracao - Concentração (mg/mL)
 * @returns {Object} Objeto com doseTotal e volume
 */
export function calculateRocuronium(peso, doseMgKg = 0.6, concentracao = 10) {
  const dose = doseMgKg * peso;
  const volume = dose / concentracao;
  return { doseTotal: dose, volume };
}
