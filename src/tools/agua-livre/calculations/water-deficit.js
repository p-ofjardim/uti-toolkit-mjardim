/**
 * Calcula o déficit de água livre usando a fórmula de Adrogue-Madias (NEJM 2000)
 * @param {number} sodium - Sódio sérico atual (mEq/L)
 * @param {number} desiredSodium - Sódio desejado (mEq/L)
 * @param {number} weight - Peso do paciente (kg)
 * @param {number} tbwPercentage - Porcentagem de TBW (Total Body Water)
 * @returns {number} Déficit de água livre em litros
 */
export function calculateWaterDeficit(sodium, desiredSodium, weight, tbwPercentage) {
  // Fórmula: Déficit (L) = %TBW × Peso × (Na_atual / Na_desejado - 1)
  return tbwPercentage * weight * (sodium / desiredSodium - 1);
}
