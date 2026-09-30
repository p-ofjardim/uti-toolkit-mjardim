/**
 * Calcula a taxa de infusão em mL/h
 * @param {number} dose - Dose desejada
 * @param {number} peso - Peso do paciente (kg)
 * @param {string} unidadeDose - Unidade da dose
 * @param {number} concentracao - Concentração da solução
 * @param {string} unidadeConc - Unidade da concentração
 * @returns {Object} Objeto com taxaMLh, doseHora, doseBase, doseBaseUnidade
 */
export function calculateInfusionRate(dose, peso, unidadeDose, concentracao, unidadeConc) {
  if (isNaN(dose) || isNaN(peso) || isNaN(concentracao)) {
    return { 
      taxaMLh: null, 
      doseHora: null, 
      doseBase: null, 
      doseBaseUnidade: null,
      concBase: null,
      concBaseUnidade: null 
    };
  }
  
  // Converte dose para mcg/h ou mg/h (unidade base)
  let doseBase;
  let doseBaseUnidade = 'mcg/h';
  
  switch(unidadeDose) {
    case 'mcg/kg/min':
      doseBase = dose * peso * 60; // mcg/h
      break;
    case 'mcg/kg/h':
      doseBase = dose * peso; // mcg/h
      break;
    case 'mg/kg/h':
      doseBase = dose * peso * 1000; // mcg/h
      break;
    case 'mcg/min':
      doseBase = dose * 60; // mcg/h
      break;
    case 'mcg/h':
      doseBase = dose; // mcg/h
      break;
    case 'U/min':
      doseBase = dose * 60; // U/h
      doseBaseUnidade = 'U/h';
      break;
    case 'mg/min':
      doseBase = dose * 60 * 1000; // mcg/h
      break;
    default:
      doseBase = dose;
  }
  
  // Converte concentração para mg/mL ou U/mL (unidade base)
  let concBase;
  let concBaseUnidade = unidadeConc;
  
  switch(unidadeConc) {
    case 'mg/mL':
      concBase = concentracao; // mg/mL
      break;
    case 'mcg/mL':
      concBase = concentracao / 1000; // mg/mL
      break;
    case 'U/mL':
      concBase = concentracao; // U/mL
      concBaseUnidade = 'U/mL';
      break;
    default:
      concBase = concentracao;
  }
  
  // Calcula taxa de infusão em mL/h
  let taxaMLh;
  if (doseBaseUnidade === 'U/h' && concBaseUnidade === 'U/mL') {
    // Caso especial: U/h ÷ U/mL = mL/h
    taxaMLh = doseBase / concBase;
  } else if (doseBaseUnidade === 'mcg/h') {
    // Converte doseBase para mg/h
    const doseMGh = doseBase / 1000;
    // Taxa = dose (mg/h) / concentração (mg/mL)
    taxaMLh = doseMGh / concBase;
  } else {
    // Para outros casos (mg/h)
    taxaMLh = doseBase / concBase;
  }
  
  // Arredonda para 2 casas decimais
  taxaMLh = Math.round(taxaMLh * 100) / 100;
  
  // Formata dose por hora
  let doseHora;
  if (doseBaseUnidade === 'mcg/h') {
    doseHora = `${doseBase.toFixed(1)} mcg/h`;
  } else if (doseBaseUnidade === 'U/h') {
    doseHora = `${doseBase.toFixed(1)} U/h`;
  } else {
    doseHora = `${doseBase.toFixed(1)} mg/h`;
  }
  
  return { 
    taxaMLh, 
    doseHora, 
    doseBase, 
    doseBaseUnidade,
    concBase,
    concBaseUnidade 
  };
}

/**
 * Calcula o tempo do frasco
 * @param {number} volumeTotal - Volume total (mL)
 * @param {number} taxaMLh - Taxa de infusão (mL/h)
 * @returns {string} Tempo formatado (ex: "2h 30min (2.5 horas)")
 */
export function calculateTempoFrasco(volumeTotal, taxaMLh) {
  if (volumeTotal <= 0 || taxaMLh <= 0) return '';
  
  const horas = volumeTotal / taxaMLh;
  const horasInt = Math.floor(horas);
  const minutos = Math.round((horas - horasInt) * 60);
  return `${horasInt}h ${minutos}min (${horas.toFixed(1)} horas)`;
}

/**
 * Calcula goteiras por minuto
 * @param {number} taxaMLh - Taxa de infusão (mL/h)
 * @returns {string} Goteiras por minuto formatado
 */
export function calculateGoteirasMin(taxaMLh) {
  const goteiras = (taxaMLh * 20) / 60; // 1 mL = 20 goteiras
  const goteirasArredondadas = Math.round(goteiras * 10) / 10;
  return `${goteirasArredondadas} gts/min`;
}
