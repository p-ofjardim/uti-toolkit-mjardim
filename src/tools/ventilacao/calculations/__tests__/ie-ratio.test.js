import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import { calculateIE, formatIEResult } from '../ie-ratio.js';

test('Tinsp=1, FR=12 should return 4', () => {
  strictEqual(calculateIE(1, 12), 4);
});

test('Tinsp=1.5, FR=10 should return 3', () => {
  strictEqual(calculateIE(1.5, 10), 3);
});

test('Tinsp >= Ttotal should return null', () => {
  strictEqual(calculateIE(5, 12), null);
});

test('Tinsp > Ttotal should return null', () => {
  strictEqual(calculateIE(6, 12), null);
});

test('NaN inputs return null', () => {
  strictEqual(calculateIE(NaN, 12), null);
  strictEqual(calculateIE(1, NaN), null);
});

test('formats IE result', () => {
  const result = formatIEResult(4);
  ok(result.includes('1:4.0'));
  ok(result.includes('Relação I:E:'));
});

test('null input shows error message', () => {
  const result = formatIEResult(null);
  ok(result.includes('Tinsp não pode ser ≥ Ttotal'));
});

test('undefined input shows error message', () => {
  const result = formatIEResult(undefined);
  ok(result.includes('Preencha todos os campos'));
});
