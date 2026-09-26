// Pure function: processes neurology section
// Input: neuro, rass, sedacao (all strings)
// Output: string describing neurological state
export function processarNeuro(neuro, rass, sedacao) {
  if (!neuro) return '';

  let texto = neuro === 'Estável' ? 'Estabilidade neurológica' : 'Instabilidade neurológica';

  if (rass) {
    texto += `, RASS ${rass}`;
  }

  if (sedacao) {
    texto += `; ${sedacao.toLowerCase()}`;
  }

  return texto + '.';
}
