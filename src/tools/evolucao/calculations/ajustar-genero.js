// Pure function to adjust gender-specific terms in text
// Takes text and gender, returns adjusted text
export function ajustarGenero(texto, sexo) {
  if (sexo === 'F') {
    texto = texto.replace(/adaptado/gi, 'adaptada');
    texto = texto.replace(/olig\u00farico/gi, 'olig\u00farica');
    texto = texto.replace(/an\u00farico/gi, 'an\u00farica');
    texto = texto.replace(/normoglic\u00eamico/gi, 'normoglic\u00eamica');
    texto = texto.replace(/disglic\u00eamico/gi, 'disglic\u00eamica');
    texto = texto.replace(/hipoglic\u00eamico/gi, 'hipoglic\u00eamica');
    texto = texto.replace(/hipot\u00e9rmico/gi, 'hipot\u00e9rmica');
  }
  return texto;
}
