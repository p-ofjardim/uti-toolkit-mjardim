/**
 * Calcula dose de Etomidato
 * @param {number} peso - Peso do paciente (kg)
 * @param {number} concentracao - Concentração (mg/mL)
 * @returns {Object} Objeto com doseTotal e volume
 */
export function calculateEtomidate(peso, concentracao = 2) {
  const dose = 0.3 * peso; // 0.3 mg/kg
  const volume = dose / concentracao;
  return { doseTotal: dose, volume };
}
