// Exporta todas as funções de cálculo para ventilação

// Ventilação
import { calculateVE, formatVEResult } from './volume-minuto.js';
import { calculateIE, formatIEResult } from './ie-ratio.js';
import { calculateCompliance, formatComplianceResult } from './compliance.js';
import { calculateResistance, formatResistanceResult } from './resistance.js';
import { calculateDrivingPressure, formatDrivingPressureResult } from './driving-pressure.js';
import { calculateVolumePesoIdeal, formatVolumePesoIdealResult } from './volume-peso-ideal.js';

// Peso
import { calculatePesoIdealHomem, formatPesoIdealHomemResult } from './peso-ideal-homem.js';
import { calculatePesoIdealMulher, formatPesoIdealMulherResult } from './peso-ideal-mulher.js';

// Gasometria
import { calculatePF, formatPFResult } from './pf-ratio.js';
import { calculatePaCO2Esperado, formatPaCO2EsperadoResult } from './paco2-esperado.js';
import { calculateHCO3Esperado, formatHCO3EsperadoResult } from './hco3-esperado.js';

// Ajustes
import { calculateAjusteFR, formatAjusteFRResult } from './ajuste-fr.js';
import { calculateAjusteVT, formatAjusteVTResult } from './ajuste-vt.js';
import { calculateAjusteVE, formatAjusteVEResult } from './ajuste-ve.js';

// Desmame
import { calculateVTEspontaneo, formatVTEspontaneoResult } from './vt-espontaneo.js';
import { calculateVEEspontaneo, formatVEEspontaneoResult } from './ve-espontaneo.js';
import { calculateRSBI, formatRSBIResult } from './rsbi.js';
import { calculateCROP, formatCROPResult } from './crop-index.js';

// Re-exporta todas as funções
export {
  // Ventilação
  calculateVE, formatVEResult,
  calculateIE, formatIEResult,
  calculateCompliance, formatComplianceResult,
  calculateResistance, formatResistanceResult,
  calculateDrivingPressure, formatDrivingPressureResult,
  calculateVolumePesoIdeal, formatVolumePesoIdealResult,
  
  // Peso
  calculatePesoIdealHomem, formatPesoIdealHomemResult,
  calculatePesoIdealMulher, formatPesoIdealMulherResult,
  
  // Gasometria
  calculatePF, formatPFResult,
  calculatePaCO2Esperado, formatPaCO2EsperadoResult,
  calculateHCO3Esperado, formatHCO3EsperadoResult,
  
  // Ajustes
  calculateAjusteFR, formatAjusteFRResult,
  calculateAjusteVT, formatAjusteVTResult,
  calculateAjusteVE, formatAjusteVEResult,
  
  // Desmame
  calculateVTEspontaneo, formatVTEspontaneoResult,
  calculateVEEspontaneo, formatVEEspontaneoResult,
  calculateRSBI, formatRSBIResult,
  calculateCROP, formatCROPResult
};
