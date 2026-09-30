/**
 * Dados dos medicamentos com diluições padrão do CTI
 * Cada medicamento contém: nome, categoria, diluição, concentração, dose usual, etc.
 */

export const medicamentos = {
  // Aminas (Vasopressores/Inotrópicos)
  noradrenalina: {
    nome: 'Noradrenalina',
    categoria: 'Aminas',
    diluicao: '5 ampolas (4mg/8mL) + SGI 5% 180 mL',
    concentracao: 0.1, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.01-3',
    unidadeDose: 'mcg/kg/min',
    observacoes: '1ª linha para choque séptico. Progressão: 6-12-18-24 mL/h. Benefício menos claro quando dose > 1 mcg/kg/min'
  },
  dobutamina: {
    nome: 'Dobutamina',
    categoria: 'Aminas',
    diluicao: '2 ampolas (250mg/20mL) + SF 0.9% 210 mL',
    concentracao: 2, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '2-20',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Dobrada. Dose usual: 3-20 mcg/kg/h. Hipotensão em doses altas (reduz SVR)'
  },
  vasopressina: {
    nome: 'Vasopressina',
    categoria: 'Aminas',
    diluicao: '1 ampola (20U/1mL) + SF 0.9% 99 mL',
    concentracao: 0.2, // U/mL
    unidadeConc: 'U/mL',
    doseUsual: '0.03-0.04',
    unidadeDose: 'U/min',
    observacoes: 'Progressão: 6-12-18-24 mL/h. Adicionar quando noradrenalina ≥ 0.25-0.5 mcg/kg/min'
  },
  dopamina: {
    nome: 'Dopamina',
    categoria: 'Aminas',
    diluicao: '5 ampolas (50mg/10mL) + SF 0.9% 200 mL',
    concentracao: 1, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '2-20',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Dose usual: 5-20 mcg/kg/min. Contraindicado em feocromocitoma'
  },
  
  // Sedaçao/Analgesia
  fentanil: {
    nome: 'Fentanil',
    categoria: 'Sedação/Analgesia',
    diluicao: '4 ampolas (50 mcg/mL, 10 mL) + SF 0.9% 160 mL',
    concentracao: 10, // mcg/mL
    unidadeConc: 'mcg/mL',
    doseUsual: '0.7-10',
    unidadeDose: 'mcg/kg/h',
    observacoes: 'Menos hipotensão que morfina. Acumula em IR. Dose intermitente: 0.35-0.5 mcg/kg a cada 30-60 min'
  },
  midazolam: {
    nome: 'Midazolam',
    categoria: 'Sedação/Analgesia',
    diluicao: '4 ampolas (5 mg/mL, 10 mL) + SF 0.9% 160 mL',
    concentracao: 1, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.02-0.1',
    unidadeDose: 'mg/kg/h',
    observacoes: 'Status epileptico: solução pura = 1-2 mg/kg/h. Meia-vida prolongada em IC, IR, HF'
  },
  propofol: {
    nome: 'Propofol',
    categoria: 'Sedação/Analgesia',
    diluicao: '5 ampolas (10 mg/mL) - PURO',
    concentracao: 10, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '5-50',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Trocar solução a cada 12h. Máximo: 67 mcg/kg/min (4 mg/kg/h). Síndrome do propofol com infusão prolongada >70 mcg/kg/min'
  },
  cetamina: {
    nome: 'Cetamina',
    categoria: 'Sedação/Analgesia',
    diluicao: '2 ampolas (500 mg/10 mL) + SF 0.9% 80 mL',
    concentracao: 10, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '20-100',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Dose de ataque: 0.1-0.5 mg/kg. Metabólito ativo (norcetamina). Pode causar alucinações'
  },
  dexmedetomidina: {
    nome: 'Dexmedetomidina',
    categoria: 'Sedação/Analgesia',
    diluicao: '1 ampola (200 mcg/2 mL) + SF 0.9% 48 mL',
    concentracao: 4, // mcg/mL
    unidadeConc: 'mcg/mL',
    doseUsual: '0.2-1.5',
    unidadeDose: 'mcg/kg/h',
    observacoes: 'Reduzir dose em IR ou >65 anos. Risco de bradicardia e hipotensão'
  },
  
  // Bloqueadores Neuromusculares
  rocuronio: {
    nome: 'Rocurônio',
    categoria: 'Bloqueadores Neuromusculares',
    diluicao: '10 mg/mL (ampola) - PURO',
    concentracao: 10, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '4-16',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Duração prolongada 50% em IR hepática. Recuperação: 15-155 min'
  },
  cisatracurio: {
    nome: 'Cisatracúrio',
    categoria: 'Bloqueadores Neuromusculares',
    diluicao: '4 ampolas (2 mg/mL) + SF 0.9% 80 mL',
    concentracao: 0.4, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.5-10.2',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Meia-vida: 20-29 min. Liberação de histamina mínima'
  },
  
  // Vasodilatadores
  nitroprussiato: {
    nome: 'Nitroprussiato',
    categoria: 'Vasodilatadores',
    diluicao: '1 ampola (50 mg/2 mL) + SGI 5% 248 mL',
    concentracao: 0.2, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '0.3-10',
    unidadeDose: 'mcg/kg/min',
    observacoes: 'Iniciar 0.3-0.5 mcg/kg/min e titular em incrementos de 0.5 mcg/kg/min até BP alvo ou dose máxima de 10 mcg/kg/min. Monitorar cianeto. ACM'
  },
  nitroglicerina: {
    nome: 'Nitroglicerina',
    categoria: 'Vasodilatadores',
    diluicao: '1 ampola (50 mg/10 mL) + SGI 5% 240 mL',
    concentracao: 0.2, // mg/mL
    unidadeConc: 'mg/mL',
    doseUsual: '5-20',
    unidadeDose: 'mcg/min',
    observacoes: 'Dose inicial: 5 mcg/min, titular em incrementos de 5 mcg/min a cada 3-5 min, até 20 mcg/min. ACM'
  }
};

/**
 * Obtém as informações de um medicamento
 * @param {string} medId - ID do medicamento
 * @returns {Object|null} Informações do medicamento ou null se não encontrado
 */
export function getMedicamento(medId) {
  return medicamentos[medId] || null;
}

/**
 * Obtém todos os IDs dos medicamentos
 * @returns {string[]} Array com todos os IDs
 */
export function getAllMedicamentoIds() {
  return Object.keys(medicamentos);
}
