import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import {
  limiteVelocidadePorPeso,
  validarAporteTotalK,
  formatLimitesSeguranca,
} from '../limites-infusao-k.js';

test('0,5 mEq/kg/h limitado a 20 mEq/h: peso 70 → 20', () => {
  strictEqual(limiteVelocidadePorPeso(70), 20);
});

test('0,5 mEq/kg/h limitado a 20 mEq/h: peso 30 → 15', () => {
  strictEqual(limiteVelocidadePorPeso(30), 15);
});

test('peso inválido retorna null', () => {
  strictEqual(limiteVelocidadePorPeso(NaN), null);
  strictEqual(limiteVelocidadePorPeso(0), null);
});

test('aporte total de K do dia integra os limites', () => {
  const texto = validarAporteTotalK(200, 10, 70);
  ok(texto.includes('20 mEq/h'));
  ok(!texto.includes('⚠️'));
});

test('aporte excedente gera aviso', () => {
  const texto = validarAporteTotalK(600, 30, 70);
  ok(texto.includes('via central'));
});

test('formata limites de segurança com peso', () => {
  ok(formatLimitesSeguranca(70).includes('80 mEq/L'));
  ok(formatLimitesSeguranca(NaN).includes('10–20 mEq/h'));
});
