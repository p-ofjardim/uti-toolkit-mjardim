import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import {
  classifyGravidadeHipocalemia,
  formatGravidadeResult,
} from '../gravidade-hipocalemia.js';

test('K 3,2 é hipocalemia leve', () => {
  strictEqual(classifyGravidadeHipocalemia(3.2, false).gravidade, 'leve');
  ok(classifyGravidadeHipocalemia(3.2, false).conduta.includes('60–80 mEq/dia'));
});

test('K 2,7 é hipocalemia moderada', () => {
  strictEqual(classifyGravidadeHipocalemia(2.7, false).gravidade, 'moderada');
});

test('K 2,2 é hipocalemia grave', () => {
  strictEqual(classifyGravidadeHipocalemia(2.2, false).gravidade, 'grave');
  ok(classifyGravidadeHipocalemia(2.2, false).conduta.includes('10 mEq/h'));
});

test('urgência sobrepõe a gravidade', () => {
  strictEqual(classifyGravidadeHipocalemia(3.2, true).gravidade, 'urgencia');
  ok(classifyGravidadeHipocalemia(3.2, true).conduta.includes('15–20 min'));
});

test('K normal não indica reposição', () => {
  strictEqual(classifyGravidadeHipocalemia(4.5, false).gravidade, 'normal');
});

test('entrada inválida retorna null', () => {
  strictEqual(classifyGravidadeHipocalemia(NaN, false), null);
});

test('formata rótulo e conduta', () => {
  const texto = formatGravidadeResult(classifyGravidadeHipocalemia(2.2, false));
  ok(texto.includes('<strong>'));
  ok(texto.includes('reavaliar'));
});
