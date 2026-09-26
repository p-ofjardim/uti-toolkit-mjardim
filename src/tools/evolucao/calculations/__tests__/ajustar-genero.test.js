import { ajustarGenero } from '../ajustar-genero.js';
import { strictEqual, ok } from 'assert';

const tests = [];

// Test 1: Male should not modify text
tests.push(async () => {
  const text = 'Paciente adaptado com oligúrico';
  const result = ajustarGenero(text, 'M');
  strictEqual(result, text);
});

// Test 2: Female should adjust adaptado
tests.push(async () => {
  const result = ajustarGenero('Paciente adaptado', 'F');
  ok(result.includes('adaptada'));
});

// Test 3: Female should adjust oligúrico
tests.push(async () => {
  const result = ajustarGenero('Diurese oligúrico', 'F');
  ok(result.includes('oligúrica'));
});

// Test 4: Female should adjust anúrico
tests.push(async () => {
  const result = ajustarGenero('Diurese anúrico', 'F');
  ok(result.includes('anúrica'));
});

// Test 5: Female should adjust normoglicêmico
tests.push(async () => {
  const result = ajustarGenero('Paciente normoglicêmico', 'F');
  ok(result.includes('normoglicêmica'));
});

// Test 6: Female should adjust disglicêmico
tests.push(async () => {
  const result = ajustarGenero('Paciente disglicêmico', 'F');
  ok(result.includes('disglicêmica'));
});

// Test 7: Female should adjust hipotérmico
tests.push(async () => {
  const result = ajustarGenero('Paciente hipotérmico', 'F');
  ok(result.includes('hipotérmica'));
});

// Test 8: Case insensitive
tests.push(async () => {
  const result = ajustarGenero('PACIENTE ADAPTADO', 'F');
  ok(result.includes('ADAPTADA'));
});

// Test 9: Multiple replacements
tests.push(async () => {
  const text = 'Paciente adaptado e oligúrico';
  const result = ajustarGenero(text, 'F');
  ok(result.includes('adaptada'));
  ok(result.includes('oligúrica'));
});

export default tests;
