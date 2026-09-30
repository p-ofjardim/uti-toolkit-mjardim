import { test } from 'node:test';
import { strictEqual } from 'node:assert/strict';
import { calculateTBWPercentage } from '../tbw-percentage.js';

test('adult male should return 0.6', () => {
  strictEqual(calculateTBWPercentage(30, 'male'), 0.6);
});

test('adult female should return 0.5', () => {
  strictEqual(calculateTBWPercentage(30, 'female'), 0.5);
});

test('elderly male (65+) should return 0.5', () => {
  strictEqual(calculateTBWPercentage(65, 'male'), 0.5);
});

test('elderly female (65+) should return 0.45', () => {
  strictEqual(calculateTBWPercentage(70, 'female'), 0.45);
});

test('male at age 64 should return 0.6', () => {
  strictEqual(calculateTBWPercentage(64, 'male'), 0.6);
});

test('female at age 64 should return 0.5', () => {
  strictEqual(calculateTBWPercentage(64, 'female'), 0.5);
});
