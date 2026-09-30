// Pure function to adjust gender-specific terms in text
// Takes text and gender, returns adjusted text
export function ajustarGenero(texto, sexo) {
  if (sexo === 'F') {
    const substituirPreservandoCaixa = (masculino, feminino) =>
      texto.replace(new RegExp(masculino, 'gi'), (match) =>
        match === match.toUpperCase() ? feminino.toUpperCase() : feminino
      );

    texto = substituirPreservandoCaixa('adaptado', 'adaptada');
    texto = substituirPreservandoCaixa('oligúrico', 'oligúrica');
    texto = substituirPreservandoCaixa('anúrico', 'anúrica');
    texto = substituirPreservandoCaixa('normoglicêmico', 'normoglicêmica');
    texto = substituirPreservandoCaixa('disglicêmico', 'disglicêmica');
    texto = substituirPreservandoCaixa('hipoglicêmico', 'hipoglicêmica');
    texto = substituirPreservandoCaixa('hipotérmico', 'hipotérmica');
  }
  return texto;
}
