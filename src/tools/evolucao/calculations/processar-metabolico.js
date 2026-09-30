// Pure function: processes metabolic section
// Input: glicemias, dhes, bic (all strings)
// Output: string describing metabolic state
export function processarMetabolico(glicemias, dhes, bic) {
  // Valores considerados "normais"
  const glicemiasNormal = glicemias === 'Normoglicêmico' || !glicemias;
  const dhesNormal = dhes === 'Sem DHEs' || !dhes;
  const bicNormal = bic === 'Sem DABs' || !bic;

  // Se todos estiverem normais
  if (glicemiasNormal && dhesNormal && bicNormal) {
    return 'Estabilidade metabólica.';
  }

  // Caso contrário, lista apenas os não normais
  const partes = [];
  if (glicemias && !glicemiasNormal) partes.push(glicemias.toLowerCase());
  if (dhes && !dhesNormal) partes.push(dhes);
  if (bic && !bicNormal) partes.push(bic.toLowerCase());

  if (partes.length === 0) return '';

  return 'Instabilidade metabólica; ' + partes.join('; ') + '.';
}
