import { gerarEvolucao } from '../gerar-evolucao.js';
import { ok } from 'assert';

const tests = [];

// Test 1: Should generate text with box number
tests.push(async () => {
  const inputs = { box: '11', data: '', sexo: 'M' };
  const result = gerarEvolucao(inputs);
  ok(result.includes('# Box 11'));
});

// Test 2: Should include hemodynamics section when present
tests.push(async () => {
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

// Test 3: Should include ventilation section when present
tests.push(async () => {
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

// Test 4: Should include neuro section when present
tests.push(async () => {
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

// Test 5: Should handle empty inputs gracefully
tests.push(async () => {
  const inputs = { box: '11', sexo: 'M' };
  const result = gerarEvolucao(inputs);
  ok(result.includes('# Box 11'));
});

// Test 6: Should include all sections when all inputs present
tests.push(async () => {
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
  ok(result.includes('Estabilidade hemodinâmica'));
  ok(result.includes('Estabilidade ventilatória'));
  ok(result.includes('Estabilidade neurológica'));
  ok(result.includes('Sem antibiótico'));
  ok(result.includes('Diurese satisfatória'));
});

export default tests;
