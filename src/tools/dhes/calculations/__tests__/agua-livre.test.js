import { test } from 'node:test';
import { strictEqual } from 'node:assert/strict';
import {
  calculateTBWPercentage,
  calculateWaterDeficit,
  calculateMaxCorrectionRate,
  calculateCorrectionPercentage,
} from '../index.js';

test('%TBW: homem adulto 0,6; mulher adulta 0,5; homem idoso 0,5; mulher idosa 0,45', () => {
  strictEqual(calculateTBWPercentage(40, 'male'), 0.6);
  strictEqual(calculateTBWPercentage(40, 'female'), 0.5);
  strictEqual(calculateTBWPercentage(70, 'male'), 0.5);
  strictEqual(calculateTBWPercentage(70, 'female'), 0.45);
});

test('déficit de água livre: Na 160, alvo 140, 70 kg, homem adulto → 6,0 L', () => {
  const deficit = calculateWaterDeficit(160, 140, 70, 0.6);
  strictEqual(Math.round(deficit * 10) / 10, 6.0);
});

test('taxa de correção máxima limitada a 10 mEq/L em 24 h', () => {
  strictEqual(calculateMaxCorrectionRate(25), 10);
  strictEqual(calculateMaxCorrectionRate(6), 6);
});

test('porcentagem de correção recomendada', () => {
  strictEqual(Math.round(calculateCorrectionPercentage(20)), 50);
  strictEqual(Math.round(calculateCorrectionPercentage(5)), 100);
});
