import { test } from 'node:test';
import { strictEqual } from 'node:assert/strict';
import { calculateEtomidate } from '../etomidate.js';

test('70kg with default concentration', () => {
  const result = calculateEtomidate(70);
  strictEqual(result.doseTotal, 21);
  strictEqual(result.volume, 10.5);
});

test('custom concentration', () => {
  const result = calculateEtomidate(70, 1);
  strictEqual(result.doseTotal, 21);
  strictEqual(result.volume, 21);
});

test('50kg patient', () => {
  const result = calculateEtomidate(50);
  strictEqual(result.doseTotal, 15);
  strictEqual(result.volume, 7.5);
});
