import { calculateKetamine } from '../ketamine.js';
import { strictEqual } from 'assert';

const tests = [];

// Test 1: 70kg with default values
tests.push(async () => {
  const result = calculateKetamine(70);
  strictEqual(result.doseTotal, 70);
  strictEqual(result.volume, 7);
});

// Test 2: Custom dose per kg
tests.push(async () => {
  const result = calculateKetamine(70, 2);
  strictEqual(result.doseTotal, 140);
  strictEqual(result.volume, 14);
});

// Test 3: Custom concentration
tests.push(async () => {
  const result = calculateKetamine(70, 1, 5);
  strictEqual(result.doseTotal, 70);
  strictEqual(result.volume, 14);
});

export default tests;
