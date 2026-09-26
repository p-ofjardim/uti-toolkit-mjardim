import { calculateInfusionRate, calculateTempoFrasco, calculateGoteirasMin } from '../infusion-rate.js';
import { strictEqual, ok } from 'assert';

const tests = [];

// Test calculateInfusionRate
// Test 1: mcg/kg/min dose
tests.push(async () => {
  const result = calculateInfusionRate(1, 70, 'mcg/kg/min', 1, 'mg/mL');
  strictEqual(result.taxaMLh, 4.2);
});

// Test 2: mcg/kg/h dose
tests.push(async () => {
  const result = calculateInfusionRate(100, 70, 'mcg/kg/h', 1, 'mg/mL');
  strictEqual(result.taxaMLh, 7);
});

// Test 3: mg/kg/h dose
tests.push(async () => {
  const result = calculateInfusionRate(1, 70, 'mg/kg/h', 1, 'mg/mL');
  strictEqual(result.taxaMLh, 70);
});

// Test 4: U/min dose with U/mL concentration
tests.push(async () => {
  const result = calculateInfusionRate(10, 70, 'U/min', 5, 'U/mL');
  strictEqual(result.taxaMLh, 120);
});

// Test 5: Invalid input
tests.push(async () => {
  const result = calculateInfusionRate(NaN, 70, 'mcg/kg/min', 1, 'mg/mL');
  strictEqual(result.taxaMLh, null);
});

// Test calculateTempoFrasco
// Test 6: 100mL at 50mL/h
tests.push(async () => {
  const result = calculateTempoFrasco(100, 50);
  strictEqual(result, '2h 0min (2.0 horas)');
});

// Test 7: 50mL at 25mL/h
tests.push(async () => {
  const result = calculateTempoFrasco(50, 25);
  strictEqual(result, '2h 0min (2.0 horas)');
});

// Test 8: Zero volume
tests.push(async () => {
  const result = calculateTempoFrasco(0, 50);
  strictEqual(result, '');
});

// Test 9: Zero rate
tests.push(async () => {
  const result = calculateTempoFrasco(100, 0);
  strictEqual(result, '');
});

// Test calculateGoteirasMin
// Test 10: 50mL/h
tests.push(async () => {
  const result = calculateGoteirasMin(50);
  strictEqual(result, '16.7 gts/min');
});

// Test 11: 100mL/h
tests.push(async () => {
  const result = calculateGoteirasMin(100);
  strictEqual(result, '33.3 gts/min');
});

export default tests;
