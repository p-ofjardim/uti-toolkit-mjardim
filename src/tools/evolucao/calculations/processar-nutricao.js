// Pure function: processes nutrition section
// Input: dieta, dietaValor, disfTgi, evacuac (all strings)
// Output: string describing nutrition state
export function processarNutricao(dieta, dietaValor, disfTgi, evacuac) {
  const partes = [];
  if (dieta) {
    if (dieta === 'Dieta enteral' && dietaValor) {
      partes.push(`Tolerando dieta enteral a ${dietaValor}`);
    } else if (dieta === 'NPT') {
      partes.push(`Tolerando ${dieta} a ${dietaValor || '???'} mL/h`);
    } else if (dieta === 'NPP') {
      partes.push(`Tolerando ${dieta} a ${dietaValor || '???'} mL/h`);
    } else if (dieta === 'Via oral') {
      partes.push('Tolerando dieta via oral');
    } else if (dieta) {
      partes.push(dieta.charAt(0).toUpperCase() + dieta.slice(1));
    }
  }
  if (disfTgi && disfTgi !== 'Sem disfunção do TGI') {
    partes.push(disfTgi.toLowerCase());
  }
  if (evacuac) {
    partes.push(evacuac.toLowerCase());
  }

  if (partes.length === 0) return '';

  return partes.join('; ') + '.';
}
