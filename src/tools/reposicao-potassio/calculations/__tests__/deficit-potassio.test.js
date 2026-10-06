import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import {
  calculateDeficitPotassio,
  faixaAlternativa70kg,
  formatDeficitPotassioResult,
} from '../deficit-potassio.js';

test('K 2,0 com 70 kg deve dar déficit 470 mEq', () => {
  strictEqual(Math.round(calculateDeficitPotassio(2.0, 70)), 470);
});

test('K 2,0 com 50 kg deve dar déficit 336 mEq', () => {
  strictEqual(Math.round(calculateDeficitPotassio(2.0, 50)), 336);
});

test('pontos exatos da tabela de 70 kg', () => {
  strictEqual(Math.round(calculateDeficitPotassio(3.0, 70)), 175);
  strictEqual(Math.round(calculateDeficitPotassio(2.5, 70)), 350);
  strictEqual(Math.round(calculateDeficitPotassio(1.5, 70)), 700);
  strictEqual(Math.round(calculateDeficitPotassio(1.0, 70)), 875);
});

test('K >= 4,0 tem déficit desprezível (0)', () => {
  strictEqual(calculateDeficitPotassio(4.2, 70), 0);
});

test('entradas inválidas retornam null', () => {
  strictEqual(calculateDeficitPotassio(NaN, 70), null);
  strictEqual(calculateDeficitPotassio(2.0, NaN), null);
  strictEqual(calculateDeficitPotassio(2.0, 0), null);
  strictEqual(calculateDeficitPotassio(-1, 70), null);
});

test('faixas alternativas de 70 kg', () => {
  strictEqual(faixaAlternativa70kg(3.2).min, 100);
  strictEqual(faixaAlternativa70kg(2.7).max, 400);
  strictEqual(faixaAlternativa70kg(2.2).max, 1000);
  strictEqual(faixaAlternativa70kg(4.5), null);
});

test('formata resultado com mEq', () => {
  ok(formatDeficitPotassioResult(470).includes('470 mEq'));
  ok(formatDeficitPotassioResult(null).includes('válidos'));
});
