// Pure function: processes hematology section
// Input: hemato, hemoterapia (strings)
// Output: string describing hematological state
export function processarHematologico(hemato, hemoterapia) {
  if (!hemato) return '';

  let texto = hemato === 'Estável' ? 'Estabilidade hematológica' : 'Instabilidade hematológica';

  if (hemoterapia && hemoterapia !== 'Sem hemoterapia') {
    texto += `, ${hemoterapia.toLowerCase()}`;
  }

  return texto.charAt(0).toUpperCase() + texto.slice(1) + '.';
}
