// Pure function to return gender-specific diurese options
// Returns object with oligurico/anurico options based on gender
export function atualizarOpcoesDiurese(sexo) {
  const isFem = sexo === 'F';
  return {
    oligurico: isFem ? 'Oligúrica' : 'Oligúrico',
    anurico: isFem ? 'Anúrica' : 'Anúrico'
  };
}
