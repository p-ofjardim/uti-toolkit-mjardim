// Pure function: processes infection section
// Input: atb, febre, infecto (all strings)
// Output: string describing infection state
export function processarInfecto(atb, febre, infecto) {
  const partes = [];
  if (atb) partes.push(atb);
  if (febre) partes.push(febre.toLowerCase());
  if (infecto) partes.push(infecto.toLowerCase());

  if (partes.length === 0) return '';

  return partes.join(', ') + '.';
}
