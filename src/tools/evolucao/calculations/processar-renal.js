// Pure function: processes renal section
// Input: diurese, diuretico, bh, escRenal (all strings)
// Output: string describing renal state
export function processarRenal(diurese, diuretico, bh, escRenal) {
  const partes = [];
  if (diurese) partes.push(diurese);
  if (diuretico) partes.push(diuretico.toLowerCase());
  if (bh) partes.push(`balanço hídrico ${bh.toLowerCase()}`);
  if (escRenal) partes.push(escRenal.toLowerCase());

  if (partes.length === 0) return '';

  // Formata com ponto e vírgula
  return partes.join('; ') + '.';
}
