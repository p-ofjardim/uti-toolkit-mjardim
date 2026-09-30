import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import { processarHemodinamica } from '../processar-hemodinamica.js';

test('all empty inputs should return stability', () => {
  const result = processarHemodinamica('', '', '', '', '');
  strictEqual(result, 'Estabilidade hemodinâmica.');
});

test('all zero inputs should return stability', () => {
  const result = processarHemodinamica('0', '0', '0', '0', '0');
  strictEqual(result, 'Estabilidade hemodinâmica.');
});

test('noradrenaline only', () => {
  const result = processarHemodinamica('5', '', '', '', '');
  ok(result.includes('Instabilidade hemodinâmica'));
  ok(result.includes('Noradrenalina a 5 mL/h'));
});

test('multiple drugs', () => {
  const result = processarHemodinamica('5', '2', '10', '', '');
  ok(result.includes('Noradrenalina a 5 mL/h'));
  ok(result.includes('Vasopressina a 2 U/min'));
  ok(result.includes('Dobutamina a 10 mcg/kg/min'));
});

test('all drugs', () => {
  const result = processarHemodinamica('5', '2', '10', '50', '2');
  ok(result.includes('Noradrenalina a 5 mL/h'));
  ok(result.includes('Vasopressina a 2 U/min'));
  ok(result.includes('Dobutamina a 10 mcg/kg/min'));
  ok(result.includes('Nitroglicerina a 50 mcg/min'));
  ok(result.includes('Nitroprussiato a 2 mcg/kg/min'));
});
