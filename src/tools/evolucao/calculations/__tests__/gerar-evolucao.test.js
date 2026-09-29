import { test } from 'node:test';
import { ok } from 'node:assert/strict';
import { gerarEvolucao } from '../gerar-evolucao.js';

test('generates text with box number', () => {
  const inputs = { box: '11', data: '', sexo: 'M' };
  const result = gerarEvolucao(inputs);
  ok(result.includes('# Box 11'));
});

test('includes hemodynamics section when drugs present', () => {
  const inputs = {
    box: '11',
    sexo: 'M',
    nora: '5',
    vaso: '',
    dobuta: '',
    tridil: '',
    nipride: ''
  };
  const result = gerarEvolucao(inputs);
  ok(result.includes('Instabilidade hemodinâmica'));
  ok(result.includes('Noradrenalina a 5 mL/h'));
});

test('includes ventilation section when present', () => {
  const inputs = {
    box: '11',
    sexo: 'M',
    ventilac: 'Estabilidade em ar ambiente',
    'ventilac-valor': '',
    vm: '',
    adapt: ''
  };
  const result = gerarEvolucao(inputs);
  ok(result.includes('Estabilidade ventilatória'));
});

test('includes neuro section when present', () => {
  const inputs = {
    box: '11',
    sexo: 'M',
    neuro: 'Estável',
    rass: '',
    sedacao: ''
  };
  const result = gerarEvolucao(inputs);
  ok(result.includes('Estabilidade neurológica'));
});

test('handles empty inputs gracefully', () => {
  const inputs = { box: '11', sexo: 'M' };
  const result = gerarEvolucao(inputs);
  ok(result.includes('# Box 11'));
});

test('includes all sections when all inputs present', () => {
  const inputs = {
    box: '11',
    sexo: 'M',
    nora: '5',
    ventilac: 'Estabilidade em ar ambiente',
    neuro: 'Estável',
    atb: 'Sem antibiótico',
    febre: 'Afebril',
    infecto: 'Sem critérios infecciosos',
    diurese: 'Diurese satisfatória',
    diuretico: 'Sem diurético',
    bh: 'Neutro',
    'esc-renal': 'Função renal preservada',
    hemato: 'Estável',
    hemoterapia: 'Sem hemoterapia',
    glicemias: 'Normoglicêmico',
    dhes: 'Sem DHEs',
    bic: 'Sem DABs',
    dieta: 'Via oral',
    'disf-tgi': 'Sem disfunção do TGI',
    evacuac: 'Evacuações presentes',
    cvc: 'Sem CVC',
    cdl: 'Sem CDL',
    pia: 'Sem PIA',
    svd: 'Sem SVD',
    'les-pele': 'Sem lesões de pele',
    profilax: 'Sem profilaxias farmacológicas'
  };
  const result = gerarEvolucao(inputs);
  ok(result.includes('Instabilidade hemodinâmica'));
  ok(result.includes('Noradrenalina a 5 mL/h'));
  ok(result.includes('Estabilidade ventilatória'));
  ok(result.includes('Estabilidade neurológica'));
  ok(result.includes('Sem antibiótico'));
  ok(result.includes('Diurese satisfatória'));
});
