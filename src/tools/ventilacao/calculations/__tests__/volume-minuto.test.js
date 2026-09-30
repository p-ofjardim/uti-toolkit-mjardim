import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import { calculateVE, formatVEResult } from '../volume-minuto.js';

test('VT=500, FR=12 should return 6', () => {
  strictEqual(calculateVE(500, 12), 6);
});

test('VT=400, FR=15 should return 6', () => {
  strictEqual(calculateVE(400, 15), 6);
});

test('NaN VT should return null', () => {
  strictEqual(calculateVE(NaN, 12), null);
});

test('NaN FR should return null', () => {
  strictEqual(calculateVE(500, NaN), null);
});

test('zero values', () => {
  strictEqual(calculateVE(0, 12), 0);
});

test('formats VE result', () => {
  const result = formatVEResult(6);
  ok(result.includes('6.0 L/min'));
  ok(result.includes('Volume Minuto:'));
});

test('null input shows error message', () => {
  const result = formatVEResult(null);
  ok(result.includes('Preencha todos os campos'));
});

test('decimal values', () => {
  const result = formatVEResult(5.5);
  ok(result.includes('5.5 L/min'));
});
