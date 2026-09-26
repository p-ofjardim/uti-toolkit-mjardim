import { calculateCompliance, formatComplianceResult } from '../compliance.js';
import { strictEqual, ok } from 'assert';

const tests = [];

// Test calculateCompliance
// Test 1: VT=500, Pplat=20, PEEP=5 should return ~33.33
tests.push(async () => {
  const result = calculateCompliance(500, 20, 5);
  strictEqual(Math.round(result * 100) / 100, 33.33);
});

// Test 2: VT=400, Pplat=15, PEEP=5 should return 40
tests.push(async () => {
  strictEqual(calculateCompliance(400, 15, 5), 40);
});

// Test 3: Pplat <= PEEP should return null
tests.push(async () => {
  strictEqual(calculateCompliance(500, 5, 5), null);
});

// Test 4: Pplat < PEEP should return null
tests.push(async () => {
  strictEqual(calculateCompliance(500, 5, 10), null);
});

// Test 5: NaN inputs
tests.push(async () => {
  strictEqual(calculateCompliance(NaN, 20, 5), null);
  strictEqual(calculateCompliance(500, NaN, 5), null);
  strictEqual(calculateCompliance(500, 20, NaN), null);
});

// Test formatComplianceResult
// Test 6: Format compliance result
tests.push(async () => {
  const result = formatComplianceResult(33.33);
  ok(result.includes('33.3 mL/cmH₂O'));
  ok(result.includes('Complacência:'));
});

// Test 7: Null input (Pplat <= PEEP)
tests.push(async () => {
  const result = formatComplianceResult(null);
  ok(result.includes('Pplat deve ser > PEEP'));
});

// Test 8: Undefined input
tests.push(async () => {
  const result = formatComplianceResult(undefined);
  ok(result.includes('Preencha todos os campos'));
});

export default tests;
