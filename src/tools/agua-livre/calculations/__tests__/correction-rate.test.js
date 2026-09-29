import { test } from 'node:test';
import { strictEqual } from 'node:assert/strict';
import { calculateMaxCorrectionRate, calculateCorrectionPercentage } from '../correction-rate.js';

test('difference >= 10 should return max correction rate of 10', () => {
  strictEqual(calculateMaxCorrectionRate(15), 10);
  strictEqual(calculateMaxCorrectionRate(20), 10);
  strictEqual(calculateMaxCorrectionRate(100), 10);
});

test('difference < 10 should return the difference', () => {
  strictEqual(calculateMaxCorrectionRate(5), 5);
  strictEqual(calculateMaxCorrectionRate(8), 8);
  strictEqual(calculateMaxCorrectionRate(0), 0);
});

test('negative differences use absolute value', () => {
  strictEqual(calculateMaxCorrectionRate(-5), 5);
  strictEqual(calculateMaxCorrectionRate(-15), 10);
});

test('difference <= 10 should return 100 percentage', () => {
  strictEqual(calculateCorrectionPercentage(5), 100);
  strictEqual(calculateCorrectionPercentage(10), 100);
});

test('percentage based on max correction', () => {
  strictEqual(calculateCorrectionPercentage(20), 50);
  strictEqual(calculateCorrectionPercentage(40), 25);
});

test('caps at 100%', () => {
  strictEqual(calculateCorrectionPercentage(1), 100);
  strictEqual(calculateCorrectionPercentage(0.5), 100);
});

test('negative differences use absolute value for percentage', () => {
  strictEqual(calculateCorrectionPercentage(-20), 50);
  strictEqual(calculateCorrectionPercentage(-10), 100);
});
