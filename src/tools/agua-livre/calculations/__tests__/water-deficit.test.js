import { calculateWaterDeficit } from '../water-deficit.js';
import { strictEqual, ok } from 'assert';

const tests = [];

// Test 1: Standard calculation
tests.push(async () => {
  const result = calculateWaterDeficit(150, 140, 70, 0.6);
  strictEqual(Math.round(result * 100) / 100, 3.0);
});

// Test 2: Equal sodium should return 0
tests.push(async () => {
  const result = calculateWaterDeficit(140, 140, 70, 0.6);
  strictEqual(result, 0);
});

// Test 3: Different TBW percentages
tests.push(async () => {
  const result1 = calculateWaterDeficit(150, 140, 70, 0.6);
  const result2 = calculateWaterDeficit(150, 140, 70, 0.5);
  ok(result1 > result2);
});

// Test 4: Higher weight increases deficit
tests.push(async () => {
  const result1 = calculateWaterDeficit(150, 140, 70, 0.6);
  const result2 = calculateWaterDeficit(150, 140, 80, 0.6);
  ok(result2 > result1);
});

// Test 5: Higher sodium difference increases deficit
tests.push(async () => {
  const result1 = calculateWaterDeficit(150, 140, 70, 0.6);
  const result2 = calculateWaterDeficit(160, 140, 70, 0.6);
  ok(result2 > result1);
});

export default tests;
