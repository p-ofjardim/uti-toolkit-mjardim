import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import { calculateCompliance, formatComplianceResult } from '../compliance.js';

test('VT=500, Pplat=20, PEEP=5 should return ~33.33', () => {
  const result = calculateCompliance(500, 20, 5);
  strictEqual(Math.round(result * 100) / 100, 33.33);
});

test('VT=400, Pplat=15, PEEP=5 should return 40', () => {
  strictEqual(calculateCompliance(400, 15, 5), 40);
});

test('Pplat <= PEEP should return null', () => {
  strictEqual(calculateCompliance(500, 5, 5), null);
});

test('Pplat < PEEP should return null', () => {
  strictEqual(calculateCompliance(500, 5, 10), null);
});

test('NaN inputs return null', () => {
  strictEqual(calculateCompliance(NaN, 20, 5), null);
  strictEqual(calculateCompliance(500, NaN, 5), null);
  strictEqual(calculateCompliance(500, 20, NaN), null);
});

test('formats compliance result', () => {
  const result = formatComplianceResult(33.33);
  ok(result.includes('33.3 mL/cmH₂O'));
  ok(result.includes('Complacência:'));
});

test('null input shows error message', () => {
  const result = formatComplianceResult(null);
  ok(result.includes('Pplat deve ser > PEEP'));
});

test('undefined input shows error message', () => {
  const result = formatComplianceResult(undefined);
  ok(result.includes('Preencha todos os campos'));
});
