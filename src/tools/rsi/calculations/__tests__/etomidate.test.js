import { calculateEtomidate } from '../etomidate.js';
import { strictEqual } from 'assert';

const tests = [];

// Test 1: 70kg with default concentration
tests.push(async () => {
  const result = calculateEtomidate(70);
  strictEqual(result.doseTotal, 21);
  strictEqual(result.volume, 10.5);
});

// Test 2: Custom concentration
tests.push(async () => {
  const result = calculateEtomidate(70, 1);
  strictEqual(result.doseTotal, 21);
  strictEqual(result.volume, 21);
});

// Test 3: 50kg patient
tests.push(async () => {
  const result = calculateEtomidate(50);
  strictEqual(result.doseTotal, 15);
  strictEqual(result.volume, 7.5);
});

export default tests;
