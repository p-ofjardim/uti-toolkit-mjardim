import { calculateIE, formatIEResult } from '../ie-ratio.js';
import { strictEqual, ok } from 'assert';

const tests = [];

// Test calculateIE
// Test 1: Tinsp=1, FR=12 should return 4
tests.push(async () => {
  strictEqual(calculateIE(1, 12), 4);
});

// Test 2: Tinsp=1.5, FR=10 should return 3
tests.push(async () => {
  strictEqual(calculateIE(1.5, 10), 3);
});

// Test 3: Tinsp >= Ttotal should return null
tests.push(async () => {
  strictEqual(calculateIE(5, 12), null);
});

// Test 4: Tinsp > Ttotal should return null
tests.push(async () => {
  strictEqual(calculateIE(6, 12), null);
});

// Test 5: NaN inputs
tests.push(async () => {
  strictEqual(calculateIE(NaN, 12), null);
  strictEqual(calculateIE(1, NaN), null);
});

// Test formatIEResult
// Test 6: Format IE result
tests.push(async () => {
  const result = formatIEResult(4);
  ok(result.includes('1:4.0'));
  ok(result.includes('Relação I:E:'));
});

// Test 7: Null input (Tinsp >= Ttotal)
tests.push(async () => {
  const result = formatIEResult(null);
  ok(result.includes('Tinsp não pode ser ≥ Ttotal'));
});

// Test 8: Undefined input
tests.push(async () => {
  const result = formatIEResult(undefined);
  ok(result.includes('Preencha todos os campos'));
});

export default tests;
