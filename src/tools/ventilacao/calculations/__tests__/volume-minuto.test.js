import { calculateVE, formatVEResult } from '../volume-minuto.js';
import { strictEqual, ok } from 'assert';

const tests = [];

// Test calculateVE
// Test 1: VT=500, FR=12 should return 6
tests.push(async () => {
  strictEqual(calculateVE(500, 12), 6);
});

// Test 2: VT=400, FR=15 should return 6
tests.push(async () => {
  strictEqual(calculateVE(400, 15), 6);
});

// Test 3: NaN VT should return null
tests.push(async () => {
  strictEqual(calculateVE(NaN, 12), null);
});

// Test 4: NaN FR should return null
tests.push(async () => {
  strictEqual(calculateVE(500, NaN), null);
});

// Test 5: Zero values
tests.push(async () => {
  strictEqual(calculateVE(0, 12), 0);
});

// Test formatVEResult
// Test 6: Format VE result
tests.push(async () => {
  const result = formatVEResult(6);
  ok(result.includes('6.0 L/min'));
  ok(result.includes('Volume Minuto:'));
});

// Test 7: Null input
tests.push(async () => {
  const result = formatVEResult(null);
  ok(result.includes('Preencha todos os campos'));
});

// Test 8: Decimal values
tests.push(async () => {
  const result = formatVEResult(5.5);
  ok(result.includes('5.5 L/min'));
});

export default tests;
