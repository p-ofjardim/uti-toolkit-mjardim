import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import {
  calculateCalcioCorrigido,
  classifyCalcioCorrigido,
  formatCalcioCorrigidoResult,
} from '../calcio-corrigido.js';

test('Ca 7,5 + albumina 2,5 → 8,7 mg/dL', () => {
  const r = calculateCalcioCorrigido(7.5, 2.5);
  strictEqual(Math.round(r * 10) / 10, 8.7);
});

test('Ca 9,0 + albumina 4,0 → 9,0 mg/dL (sem correção)', () => {
  strictEqual(calculateCalcioCorrigido(9.0, 4.0), 9.0);
});

test('Ca 10,0 + albumina 3,0 → 10,8 mg/dL', () => {
  strictEqual(calculateCalcioCorrigido(10.0, 3.0), 10.8);
});

test('entradas inválidas retornam null', () => {
  strictEqual(calculateCalcioCorrigido(NaN, 3.0), null);
  strictEqual(calculateCalcioCorrigido(9.0, NaN), null);
  strictEqual(calculateCalcioCorrigido(-1, 3.0), null);
});

test('classificação do resultado', () => {
  strictEqual(classifyCalcioCorrigido(7.5).classificacao, 'hipocalcemia');
  strictEqual(classifyCalcioCorrigido(9.5).classificacao, 'normal');
  strictEqual(classifyCalcioCorrigido(11.5).classificacao, 'hipercalcemia');
  strictEqual(classifyCalcioCorrigido(null), null);
});

test('formata resultado com vírgula decimal', () => {
  const texto = formatCalcioCorrigidoResult(7.5, 2.5);
  ok(texto.includes('8,70 mg/dL'));
  ok(texto.includes('faixa usual'));
  ok(formatCalcioCorrigidoResult(null, null).includes('válidos'));
});
