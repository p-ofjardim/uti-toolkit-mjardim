import { test } from 'node:test';
import { strictEqual } from 'node:assert/strict';
import { calculateKetamine } from '../ketamine.js';

test('70kg with default values', () => {
  const result = calculateKetamine(70);
  strictEqual(result.doseTotal, 70);
  strictEqual(result.volume, 7);
});

test('custom dose per kg', () => {
  const result = calculateKetamine(70, 2);
  strictEqual(result.doseTotal, 140);
  strictEqual(result.volume, 14);
});

test('custom concentration', () => {
  const result = calculateKetamine(70, 1, 5);
  strictEqual(result.doseTotal, 70);
  strictEqual(result.volume, 14);
});
