// Pure function: orchestrates all section processors to generate evolution text
// Input: all form inputs as an object
// Output: final evolution text string

// Import all processor functions
import { processarHemodinamica } from './processar-hemodinamica.js';
import { processarVentilacao } from './processar-ventilacao.js';
import { processarNeuro } from './processar-neuro.js';
import { processarInfecto } from './processar-infecto.js';
import { processarRenal } from './processar-renal.js';
import { processarHematologico } from './processar-hematologico.js';
import { processarMetabolico } from './processar-metabolico.js';
import { processarNutricao } from './processar-nutricao.js';
import { processarLesoesPele } from './processar-lesoes-pele.js';
import { processarInvasoes } from './processar-invasoes.js';
import { processarProfilaxia } from './processar-profilaxia.js';

export function gerarEvolucao(inputs) {
  const {
    box,
    data,
    sexo,
    nora,
    vaso,
    dobuta,
    tridil,
    nipride,
    ventilac,
    'ventilac-valor': ventilacValor,
    vm,
    adapt,
    neuro,
    rass,
    sedacao,
    atb,
    febre,
    infecto,
    diurese,
    diuretico,
    bh,
    'esc-renal': escRenal,
    hemato,
    hemoterapia,
    glicemias,
    dhes,
    bic,
    dieta,
    'dieta-valor': dietaValor,
    'disf-tgi': disfTgi,
    evacuac,
    cvc,
    cdl,
    pia,
    svd,
    'les-pele': lesPele,
    profilax
  } = inputs;

  const linhas = [];

  // 1. HEMODINÂMICA
  const hemoText = processarHemodinamica(nora, vaso, dobuta, tridil, nipride);
  if (hemoText) linhas.push(hemoText);

  // 2. VENTILAÇÃO
  const ventText = processarVentilacao(ventilac, ventilacValor, vm, adapt);
  if (ventText) linhas.push(ventText);

  // 3. NEUROLÓGICO + SEDAÇÃO
  const neuroText = processarNeuro(neuro, rass, sedacao);
  if (neuroText) linhas.push(neuroText);

  // 4. INFECÇÃO
  const infectoText = processarInfecto(atb, febre, infecto);
  if (infectoText) linhas.push(infectoText);

  // 5. RENAL
  const renalText = processarRenal(diurese, diuretico, bh, escRenal);
  if (renalText) linhas.push(renalText);

  // 6. HEMATOLÓGICO
  const hematologicoText = processarHematologico(hemato, hemoterapia);
  if (hematologicoText) linhas.push(hematologicoText);

  // 7. METABÓLICO
  const metabolicoText = processarMetabolico(glicemias, dhes, bic);
  if (metabolicoText) linhas.push(metabolicoText);

  // 8. NUTRIÇÃO + ELIMINAÇÃO
  const nutricaoText = processarNutricao(dieta, dietaValor, disfTgi, evacuac);
  if (nutricaoText) linhas.push(nutricaoText);

  // 9. LESÕES DE PELE
  const lesoesPeleText = processarLesoesPele(lesPele);
  if (lesoesPeleText) linhas.push(lesoesPeleText);

  // 10. INVASÕES
  const invasoesText = processarInvasoes(cvc, cdl, pia, svd);
  if (invasoesText) linhas.push(invasoesText);

  // 11. PROFILAXIA
  const profilaxiaText = processarProfilaxia(profilax);
  if (profilaxiaText) linhas.push(profilaxiaText);

  // Monta o texto final
  let textoFinal = `# Box ${box}\n\n`;
  textoFinal += linhas.join('\n\n');

  return textoFinal;
}
