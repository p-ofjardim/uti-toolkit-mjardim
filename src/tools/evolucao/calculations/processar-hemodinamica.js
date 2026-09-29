// Pure function: processes hemodynamics section
// Input: nora, vaso, dobuta, tridil, nipride (all strings)
// Output: string describing hemodynamic state
export function processarHemodinamica(nora, vaso, dobuta, tridil, nipride) {
  const temDroga = (valor) => valor && parseFloat(valor) > 0;

  // Se todos vazios ou zero
  if (
    !temDroga(nora) &&
    !temDroga(vaso) &&
    !temDroga(dobuta) &&
    !temDroga(tridil) &&
    !temDroga(nipride)
  ) {
    return 'Estabilidade hemodinâmica.';
  }

  // Se algum tem valor
  const drogas = [];
  if (nora) drogas.push(`Noradrenalina a ${nora} mL/h`);
  if (vaso) drogas.push(`Vasopressina a ${vaso} U/min`);
  if (dobuta) drogas.push(`Dobutamina a ${dobuta} mcg/kg/min`);
  if (tridil) drogas.push(`Nitroglicerina a ${tridil} mcg/min`);
  if (nipride) drogas.push(`Nitroprussiato a ${nipride} mcg/kg/min`);

  return `Instabilidade hemodinâmica, em uso de ${drogas.join(', ')}.`;
}
