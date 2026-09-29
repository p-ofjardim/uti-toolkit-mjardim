import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import { calculateWaterDeficit } from '../water-deficit.js';

test('standard calculation', () => {
  const result = calculateWaterDeficit(150, 140, 70, 0.6);
  strictEqual(Math.round(result * 100) / 100, 3.0);
});

test('equal sodium should return 0', () => {
  const result = calculateWaterDeficit(140, 140, 70, 0.6);
  strictEqual(result, 0);
});

test('different TBW percentages change deficit', () => {
  const result1 = calculateWaterDeficit(150, 140, 70, 0.6);
  const result2 = calculateWaterDeficit(150, 140, 70, 0.5);
  ok(result1 > result2);
});

test('higher weight increases deficit', () => {
  const result1 = calculateWaterDeficit(150, 140, 70, 0.6);
  const result2 = calculateWaterDeficit(150, 140, 80, 0.6);
  ok(result2 > result1);
});

test('higher sodium difference increases deficit', () => {
  const result1 = calculateWaterDeficit(150, 140, 70, 0.6);
  const result2 = calculateWaterDeficit(160, 140, 70, 0.6);
  ok(result2 > result1);
});
