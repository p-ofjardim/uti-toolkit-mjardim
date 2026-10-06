// Exporta todas as funções de cálculo dos distúrbios hidroeletrolíticos
// Potássio
import {
  calculateDeficitPotassio,
  faixaAlternativa70kg,
  formatDeficitPotassioResult,
} from './deficit-potassio.js';
import {
  classifyGravidadeHipocalemia,
  formatGravidadeResult,
} from './gravidade-hipocalemia.js';
import {
  limiteVelocidadePorPeso,
  validarAporteTotalK,
  formatLimitesSeguranca,
} from './limites-infusao-k.js';
// Fosfato
import {
  selecionarSal,
  calculateFosfatoPotassio,
  formatFosfatoResult,
} from './fosfato-potassio.js';
// Sódio / água livre
import { calculateTBWPercentage } from './tbw-percentage.js';
import { calculateWaterDeficit } from './water-deficit.js';
import {
  calculateMaxCorrectionRate,
  calculateCorrectionPercentage,
} from './correction-rate.js';
// Cálcio
import {
  calculateCalcioCorrigido,
  classifyCalcioCorrigido,
  formatCalcioCorrigidoResult,
} from './calcio-corrigido.js';

export {
  calculateDeficitPotassio,
  faixaAlternativa70kg,
  formatDeficitPotassioResult,
  classifyGravidadeHipocalemia,
  formatGravidadeResult,
  limiteVelocidadePorPeso,
  validarAporteTotalK,
  formatLimitesSeguranca,
  selecionarSal,
  calculateFosfatoPotassio,
  formatFosfatoResult,
  calculateTBWPercentage,
  calculateWaterDeficit,
  calculateMaxCorrectionRate,
  calculateCorrectionPercentage,
  calculateCalcioCorrigido,
  classifyCalcioCorrigido,
  formatCalcioCorrigidoResult,
};
