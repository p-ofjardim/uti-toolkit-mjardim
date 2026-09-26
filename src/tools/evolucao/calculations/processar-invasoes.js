// Pure function: processes invasions section
// Input: cvc, cdl, pia, svd (all strings)
// Output: string describing invasion state
export function processarInvasoes(cvc, cdl, pia, svd) {
  const invasoes = [];
  if (cvc && cvc !== 'Sem CVC') invasoes.push(`CVC em ${cvc}`);
  if (cdl && cdl !== 'Sem CDL') invasoes.push(`CDL em ${cdl}`);
  if (pia && pia !== 'Sem PIA') invasoes.push(`PIA em ${pia}`);
  if (svd === 'Com SVD') invasoes.push('em uso de SVD');

  if (invasoes.length === 0) {
    return 'Sem invasões.';
  }

  return invasoes.join('; ') + '.';
}
