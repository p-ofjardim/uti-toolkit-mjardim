// Exporta todas as funções de cálculo de reposição de potássio
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
import {
  selecionarSal,
  calculateFosfatoPotassio,
  formatFosfatoResult,
} from './fosfato-potassio.js';

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
};
