import { processarHemodinamica } from '../processar-hemodinamica.js';
import { strictEqual, ok } from 'assert';

const tests = [];

// Test 1: All empty inputs should return stability
tests.push(async () => {
  const result = processarHemodinamica('', '', '', '', '');
  strictEqual(result, 'Estabilidade hemodinâmica.');
});

// Test 2: All zero inputs should return stability
tests.push(async () => {
  const result = processarHemodinamica('0', '0', '0', '0', '0');
  strictEqual(result, 'Estabilidade hemodinâmica.');
});

// Test 3: Noradrenaline only
tests.push(async () => {
  const result = processarHemodinamica('5', '', '', '', '');
  ok(result.includes('Instabilidade hemodinâmica'));
  ok(result.includes('Noradrenalina a 5 mL/h'));
});

// Test 4: Multiple drugs
tests.push(async () => {
  const result = processarHemodinamica('5', '2', '10', '', '');
  ok(result.includes('Noradrenalina a 5 mL/h'));
  ok(result.includes('Vasopressina a 2 U/min'));
  ok(result.includes('Dobutamina a 10 mcg/kg/min'));
});

// Test 5: All drugs
tests.push(async () => {
  const result = processarHemodinamica('5', '2', '10', '50', '2');
  ok(result.includes('Noradrenalina a 5 mL/h'));
  ok(result.includes('Vasopressina a 2 U/min'));
  ok(result.includes('Dobutamina a 10 mcg/kg/min'));
  ok(result.includes('Nitroglicerina a 50 mcg/min'));
  ok(result.includes('Nitroprussiato a 2 mcg/kg/min'));
});

export default tests;
