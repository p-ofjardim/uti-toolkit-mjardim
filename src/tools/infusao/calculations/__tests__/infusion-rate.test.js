import { test } from 'node:test';
import { strictEqual } from 'node:assert/strict';
import { calculateInfusionRate, calculateTempoFrasco, calculateGoteirasMin } from '../infusion-rate.js';

test('mcg/kg/min dose', () => {
  const result = calculateInfusionRate(1, 70, 'mcg/kg/min', 1, 'mg/mL');
  strictEqual(result.taxaMLh, 4.2);
});

test('mcg/kg/h dose', () => {
  const result = calculateInfusionRate(100, 70, 'mcg/kg/h', 1, 'mg/mL');
  strictEqual(result.taxaMLh, 7);
});

test('mg/kg/h dose', () => {
  const result = calculateInfusionRate(1, 70, 'mg/kg/h', 1, 'mg/mL');
  strictEqual(result.taxaMLh, 70);
});

test('U/min dose with U/mL concentration', () => {
  const result = calculateInfusionRate(10, 70, 'U/min', 5, 'U/mL');
  strictEqual(result.taxaMLh, 120);
});

test('invalid input returns null rate', () => {
  const result = calculateInfusionRate(NaN, 70, 'mcg/kg/min', 1, 'mg/mL');
  strictEqual(result.taxaMLh, null);
});

test('100mL at 50mL/h bottle time', () => {
  const result = calculateTempoFrasco(100, 50);
  strictEqual(result, '2h 0min (2.0 horas)');
});

test('50mL at 25mL/h bottle time', () => {
  const result = calculateTempoFrasco(50, 25);
  strictEqual(result, '2h 0min (2.0 horas)');
});

test('zero volume returns empty string', () => {
  const result = calculateTempoFrasco(0, 50);
  strictEqual(result, '');
});

test('zero rate returns empty string', () => {
  const result = calculateTempoFrasco(100, 0);
  strictEqual(result, '');
});

test('50mL/h drip rate', () => {
  const result = calculateGoteirasMin(50);
  strictEqual(result, '16.7 gts/min');
});

test('100mL/h drip rate', () => {
  const result = calculateGoteirasMin(100);
  strictEqual(result, '33.3 gts/min');
});
