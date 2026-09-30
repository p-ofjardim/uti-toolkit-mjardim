// Pure function: processes ventilation section
// Input: ventilac, ventilacValor, vm, adapt (all strings)
// Output: string describing ventilation state
export function processarVentilacao(ventilac, ventilacValor, vm, adapt) {
  if (!ventilac) return '';

  let texto = '';

  switch (ventilac) {
    case 'Estabilidade em ar ambiente':
      texto = 'Estabilidade ventilatória';
      break;
    case 'Estabilidade em oxigenoterapia':
      texto = 'Estabilidade ventilatória, em oxigenoterapia de baixo fluxo';
      break;
    case 'Traqueostomia com oxigenoterapia':
      texto = 'Estabilidade ventilatória, em oxigenoterapia pela traqueostomia';
      break;
    case 'Traqueostomia em ar ambiente':
      texto = 'Estabilidade ventilatória, traqueostomia em ar ambiente';
      break;
    case 'Instabilidade':
      texto = 'Instabilidade ventilatória';
      break;
    case 'Masc. Alto Fluxo':
      texto = `Instabilidade ventilatória, em uso de máscara de alto fluxo a ${ventilacValor || '???'} L/min`;
      break;
    case 'Masc. Venturi':
      texto = `Instabilidade ventilatória, em uso de máscara de Venturi a ${ventilacValor || '???'}%`;
      break;
    default:
      return '';
  }

  // Adiciona VM e adaptação se preenchidos
  if (vm) {
    const adaptText = adapt ? `, ${adapt.toLowerCase()}` : '';
    texto += ` em ${vm}${adaptText}`;
  }

  return texto + '.';
}
