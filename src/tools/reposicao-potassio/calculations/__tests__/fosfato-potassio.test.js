import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import {
  selecionarSal,
  calculateFosfatoPotassio,
  formatFosfatoResult,
} from '../fosfato-potassio.js';

test('PO₄ 1,2 com 70 kg → 30 mmol, 10 mL, 43 mEq de K', () => {
  const r = calculateFosfatoPotassio(1.2, 70);
  strictEqual(r.doseMmol, 30);
  strictEqual(r.volumeMl, 10);
  strictEqual(r.potassiumMEq, 43);
  strictEqual(r.infusionHours, 6);
});

test('tabela completa por faixa de peso', () => {
  strictEqual(calculateFosfatoPotassio(0.8, 50).doseMmol, 30);
  strictEqual(calculateFosfatoPotassio(0.8, 70).doseMmol, 40);
  strictEqual(calculateFosfatoPotassio(0.8, 100).doseMmol, 50);
  strictEqual(calculateFosfatoPotassio(1.5, 70).doseMmol, 30);
  strictEqual(calculateFosfatoPotassio(2.0, 50).doseMmol, 10);
  strictEqual(calculateFosfatoPotassio(2.4, 100).doseMmol, 20);
});

test('fosfatemia acima de 2,5 ou peso fora da tabela retorna null', () => {
  strictEqual(calculateFosfatoPotassio(3.0, 70), null);
  strictEqual(calculateFosfatoPotassio(1.2, 130), null);
  strictEqual(calculateFosfatoPotassio(1.2, 30), null);
});

test('sal: K 3,1 → fosfato de potássio; K 4,2 → fosfato de sódio', () => {
  strictEqual(selecionarSal(3.1), 'fosfato de potássio');
  strictEqual(selecionarSal(4.2), 'fosfato de sódio');
});

test('formato do resultado traz dose, volume, K e tempo', () => {
  const texto = formatFosfatoResult(calculateFosfatoPotassio(1.2, 70));
  ok(texto.includes('30 mmol'));
  ok(texto.includes('10 mL'));
  ok(texto.includes('43 mEq de K'));
  ok(texto.includes('6 h'));
});
