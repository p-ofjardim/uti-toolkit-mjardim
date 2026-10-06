/**
 * Dose diária de KCl por gravidade da hipocalemia (DynaMed) e limites de
 * segurança da infusão IV (Marino PL, The ICU Book, cap. Potassium).
 *
 * Limites: 10–20 mEq/h pela periferia (0,5 mEq/kg/h até máximo de 10–20 mEq/h);
 * concentração máxima de 80 mEq/L na periferia; até 40 mEq/h apenas com via
 * central e monitorização contínua em situações excepcionais; nunca em bolus
 * fora da urgência. Na CAD: KCl 10–30 mEq/L/h para manter K entre 4 e 5 mEq/L;
 * reter insulina se K < 3,3 mEq/L; déficit médio de 3 a 5 mEq/kg.
 */
export function limiteVelocidadePeriferica(weightKg) {
  if (typeof weightKg !== 'number' || !Number.isFinite(weightKg) || weightKg <= 0) {
    return null;
  }
  return { min: 10, max: 20, porPeso: 0.5 * weightKg };
}

export function limiteVelocidadePorPeso(weightKg) {
  const periferica = limiteVelocidadePeriferica(weightKg);
  if (!periferica) return null;
  return Math.min(periferica.porPeso, 20);
}

/**
 * Valida a soma do aporte total de K do dia (KCl do dia + K do fosfato de
 * potássio) contra o limite de velocidade de infusão ajustado ao peso.
 * Retorna mensagem de texto pronta.
 */
export function validarAporteTotalK(aporteTotalMEqDia, velocidadeMEqH, weightKg) {
  if (
    typeof aporteTotalMEqDia !== 'number' || !Number.isFinite(aporteTotalMEqDia) ||
    typeof velocidadeMEqH !== 'number' || !Number.isFinite(velocidadeMEqH)
  ) {
    return 'Informe aporte total e velocidade de infusão válidos.';
  }
  const limite = limiteVelocidadePorPeso(weightKg);
  if (limite === null) return 'Informe um peso válido para validar os limites.';
  const maxDia = limite * 24;
  let texto = `Limite pela periferia: ${limite.toFixed(0)} mEq/h e ~${Math.round(maxDia)} mEq em 24 h`;
  if (velocidadeMEqH > 20) {
    texto += '. ⚠️ Velocidade acima de 20 mEq/h exige via central e monitorização contínua.';
  } else if (velocidadeMEqH > limite) {
    texto += '. ⚠️ Velocidade acima do limite periférico ajustado ao peso.';
  }
  if (aporteTotalMEqDia > maxDia) {
    texto += ' ⚠️ Aporte total do dia excede o máximo seguro em infusão contínua.';
  }
  return texto;
}

export function formatLimitesSeguranca(weightKg) {
  const limite = limiteVelocidadePorPeso(weightKg);
  if (limite === null) {
    return 'Velocidade periférica: 10–20 mEq/h (0,5 mEq/kg/h).';
  }
  return `Velocidade periférica: 10–20 mEq/h (0,5 mEq/kg/h → ${limite.toFixed(0)} mEq/h neste peso). Concentração máxima periférica: 80 mEq/L. Via central excepcional: até 40 mEq/h com monitorização contínua. Nunca bolus fora da urgência; cautela na insuficiência renal; verificar magnesemia na reposição refratária.`;
}
