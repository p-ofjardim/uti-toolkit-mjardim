import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import { ajustarGenero } from '../ajustar-genero.js';

test('male should not modify text', () => {
  const text = 'Paciente adaptado com oligúrico';
  const result = ajustarGenero(text, 'M');
  strictEqual(result, text);
});

test('female should adjust adaptado', () => {
  const result = ajustarGenero('Paciente adaptado', 'F');
  ok(result.includes('adaptada'));
});

test('female should adjust oligúrico', () => {
  const result = ajustarGenero('Diurese oligúrico', 'F');
  ok(result.includes('oligúrica'));
});

test('female should adjust anúrico', () => {
  const result = ajustarGenero('Diurese anúrico', 'F');
  ok(result.includes('anúrica'));
});

test('female should adjust normoglicêmico', () => {
  const result = ajustarGenero('Paciente normoglicêmico', 'F');
  ok(result.includes('normoglicêmica'));
});

test('female should adjust disglicêmico', () => {
  const result = ajustarGenero('Paciente disglicêmico', 'F');
  ok(result.includes('disglicêmica'));
});

test('female should adjust hipotérmico', () => {
  const result = ajustarGenero('Paciente hipotérmico', 'F');
  ok(result.includes('hipotérmica'));
});

test('case insensitive adjustment preserves uppercase', () => {
  const result = ajustarGenero('PACIENTE ADAPTADO', 'F');
  ok(result.includes('ADAPTADA'));
});

test('multiple replacements in one text', () => {
  const result = ajustarGenero('Paciente adaptado e oligúrico', 'F');
  ok(result.includes('adaptada'));
  ok(result.includes('oligúrica'));
});
