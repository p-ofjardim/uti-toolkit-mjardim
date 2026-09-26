import { calculateTBWPercentage } from '../tbw-percentage.js';
import { strictEqual } from 'assert';

// Test suite for calculateTBWPercentage
const tests = [];

// Test 1: Adult male should return 0.6
tests.push(async () => {
  strictEqual(calculateTBWPercentage(30, 'male'), 0.6);
});

// Test 2: Adult female should return 0.5
tests.push(async () => {
  strictEqual(calculateTBWPercentage(30, 'female'), 0.5);
});

// Test 3: Elderly male (65+) should return 0.5
tests.push(async () => {
  strictEqual(calculateTBWPercentage(65, 'male'), 0.5);
});

// Test 4: Elderly female (65+) should return 0.45
tests.push(async () => {
  strictEqual(calculateTBWPercentage(70, 'female'), 0.45);
});

// Test 5: Male at age 64 should return 0.6
tests.push(async () => {
  strictEqual(calculateTBWPercentage(64, 'male'), 0.6);
});

// Test 6: Female at age 64 should return 0.5
tests.push(async () => {
  strictEqual(calculateTBWPercentage(64, 'female'), 0.5);
});

export default tests;
