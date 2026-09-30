/**
 * Calcula dose de Metohexital
 * @param {number} peso - Peso do paciente (kg)
 * @param {number} concentracao - Concentração (mg/mL)
 * @returns {Object} Objeto com doseTotal e volume
 */
export function calculateMethohexital(peso, concentracao = 10) {
  const dose = 1.5 * peso; // 1.5 mg/kg
  const volume = dose / concentracao;
  return { doseTotal: dose, volume };
}
