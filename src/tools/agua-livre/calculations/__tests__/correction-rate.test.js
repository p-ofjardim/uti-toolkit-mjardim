import { calculateMaxCorrectionRate, calculateCorrectionPercentage } from '../correction-rate.js';
import { strictEqual } from 'assert';

const tests = [];

// Test calculateMaxCorrectionRate
// Test 1: Difference >= 10 should return 10
tests.push(async () => {
  strictEqual(calculateMaxCorrectionRate(15), 10);
  strictEqual(calculateMaxCorrectionRate(20), 10);
  strictEqual(calculateMaxCorrectionRate(100), 10);
});

// Test 2: Difference < 10 should return the difference
tests.push(async () => {
  strictEqual(calculateMaxCorrectionRate(5), 5);
  strictEqual(calculateMaxCorrectionRate(8), 8);
  strictEqual(calculateMaxCorrectionRate(0), 0);
});

// Test 3: Negative differences
tests.push(async () => {
  strictEqual(calculateMaxCorrectionRate(-5), 5);
  strictEqual(calculateMaxCorrectionRate(-15), 10);
});

// Test calculateCorrectionPercentage
// Test 4: Difference <= 10 should return 100
tests.push(async () => {
  strictEqual(calculateCorrectionPercentage(5), 100);
  strictEqual(calculateCorrectionPercentage(10), 100);
});

// Test 5: Percentage based on max correction
tests.push(async () => {
  strictEqual(calculateCorrectionPercentage(20), 50);
  strictEqual(calculateCorrectionPercentage(40), 25);
});

// Test 6: Cap at 100%
tests.push(async () => {
  strictEqual(calculateCorrectionPercentage(1), 100);
  strictEqual(calculateCorrectionPercentage(0.5), 100);
});

// Test 7: Negative differences
tests.push(async () => {
  strictEqual(calculateCorrectionPercentage(-20), 50);
  strictEqual(calculateCorrectionPercentage(-10), 100);
});

export default tests;
