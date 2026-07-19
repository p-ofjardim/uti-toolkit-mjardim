/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
// Dados dos medicamentos (diluições padrão do CTI)
        const medicamentos = {
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
                observacoes: 'Status epiléptico: solução pura = 1-2 mg/kg/h. Meia-vida prolongada em IC, IR, HF'
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
        
        // Elementos do DOM
        const form = document.getElementById('infusionForm');
        const medicamentoSelect = document.getElementById('medicamento');
        const doseInput = document.getElementById('dose');
        const unidadeDoseSelect = document.getElementById('unidadeDose');
        const pesoInput = document.getElementById('peso');
        const concentracaoInput = document.getElementById('concentracao');
        const unidadeConcSelect = document.getElementById('unidadeConc');
        const volumeTotalInput = document.getElementById('volumeTotal');
        const medInfoDiv = document.getElementById('medInfo');
        const resultDiv = document.getElementById('result');
        const taxaInfusaoDiv = document.getElementById('taxaInfusao');
        const doseHoraDiv = document.getElementById('doseHora');
        const tempoFrascoDiv = document.getElementById('tempoFrasco');
        const tempoFrascoItem = document.getElementById('tempoFrascoItem');
        const goteirasMinDiv = document.getElementById('goteirasMin');
        const goteirasItem = document.getElementById('goteirasItem');
        
        // Preenche campos automaticamente ao selecionar medicamento
        medicamentoSelect.addEventListener('change', function() {
            const med = medicamentos[this.value];
            if (med && this.value !== 'outros') {
                // Preenche campos automaticamente
                doseInput.value = med.doseUsual.split('-')[0];
                unidadeDoseSelect.value = med.unidadeDose;
                concentracaoInput.value = med.concentracao;
                unidadeConcSelect.value = med.unidadeConc;

                // Monta conteúdo com DOM (evita innerHTML dinâmico)
                medInfoDiv.textContent = '';
                var mStrong = document.createElement('strong');
                mStrong.textContent = med.nome;
                medInfoDiv.appendChild(mStrong);
                medInfoDiv.append(' (' + med.categoria + ')');
                medInfoDiv.appendChild(document.createElement('br'));
                medInfoDiv.append('Diluição padrão: ' + med.diluicao);
                medInfoDiv.appendChild(document.createElement('br'));
                medInfoDiv.append('Concentração: ' + med.concentracao + ' ' + med.unidadeConc);
                medInfoDiv.appendChild(document.createElement('br'));
                var mEm = document.createElement('em');
                mEm.textContent = med.observacoes;
                medInfoDiv.appendChild(mEm);
                medInfoDiv.style.display = 'block';
            } else if (this.value === 'outros') {
                // Limpa campos para entrada manual
                doseInput.value = '';
                concentracaoInput.value = '';
                medInfoDiv.textContent = '';
                var outrEm = document.createElement('em');
                outrEm.textContent = 'Preencha os campos manualmente para medicamentos personalizados';
                medInfoDiv.appendChild(outrEm);
                medInfoDiv.style.display = 'block';
            } else {
                medInfoDiv.style.display = 'none';
            }
        });
        
        // Função para calcular
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const medicamento = medicamentoSelect.value;
            const dose = parseFloat(doseInput.value);
            const unidadeDose = unidadeDoseSelect.value;
            const peso = parseFloat(pesoInput.value);
            const concentracao = parseFloat(concentracaoInput.value);
            const unidadeConc = unidadeConcSelect.value;
            const volumeTotal = parseFloat(volumeTotalInput.value) || 0;
            
            // Validações
            if (!medicamento) {
                alert('Selecione um medicamento');
                return;
            }
            if (isNaN(dose) || isNaN(peso) || isNaN(concentracao)) {
                alert('Preencha todos os campos obrigatórios');
                return;
            }
            
            // Converte dose para mcg/h ou mg/h (unidade base)
            let doseBase; // em mcg/h ou mg/h
            let doseBaseUnidade = 'mcg/h';
            
            switch(unidadeDose) {
                case 'mcg/kg/min':
                    doseBase = dose * peso * 60; // mcg/h
                    break;
                case 'mcg/kg/h':
                    doseBase = dose * peso; // mcg/h
                    break;
                case 'mg/kg/h':
                    doseBase = dose * peso * 1000; // mcg/h
                    break;
                case 'mcg/min':
                    doseBase = dose * 60; // mcg/h
                    break;
                case 'mcg/h':
                    doseBase = dose; // mcg/h
                    break;
                case 'U/min':
                    doseBase = dose * 60; // U/h
                    doseBaseUnidade = 'U/h';
                    break;
                case 'mg/min':
                    doseBase = dose * 60 * 1000; // mcg/h
                    break;
                default:
                    doseBase = dose;
            }
            
            // Converte concentração para mg/mL ou U/mL (unidade base)
            let concBase;
            let concBaseUnidade = unidadeConc;
            
            switch(unidadeConc) {
                case 'mg/mL':
                    concBase = concentracao; // mg/mL
                    break;
                case 'mcg/mL':
                    concBase = concentracao / 1000; // mg/mL
                    break;
                case 'U/mL':
                    concBase = concentracao; // U/mL
                    concBaseUnidade = 'U/mL';
                    break;
                default:
                    concBase = concentracao;
            }
            
            // Calcula taxa de infusão em mL/h
            let taxaMLh;
            if (doseBaseUnidade === 'U/h' && concBaseUnidade === 'U/mL') {
                // Caso especial: U/h ÷ U/mL = mL/h
                taxaMLh = doseBase / concBase;
            } else if (doseBaseUnidade === 'mcg/h') {
                // Converte doseBase para mg/h
                const doseMGh = doseBase / 1000;
                // Taxa = dose (mg/h) / concentração (mg/mL)
                taxaMLh = doseMGh / concBase;
            } else {
                // Para outros casos (mg/h)
                taxaMLh = doseBase / concBase;
            }
            
            // Arredonda para 2 casas decimais
            taxaMLh = Math.round(taxaMLh * 100) / 100;
            
            // Calcula dose total por hora
            let doseHoraText;
            if (doseBaseUnidade === 'mcg/h') {
                doseHoraText = `${doseBase.toFixed(1)} mcg/h`;
            } else if (doseBaseUnidade === 'U/h') {
                doseHoraText = `${doseBase.toFixed(1)} U/h`;
            } else {
                doseHoraText = `${doseBase.toFixed(1)} mg/h`;
            }
            
            // Calcula tempo do frasco (se volume total informado)
            let tempoFrascoText = '';
            if (volumeTotal > 0 && taxaMLh > 0) {
                const horas = volumeTotal / taxaMLh;
                const horasInt = Math.floor(horas);
                const minutos = Math.round((horas - horasInt) * 60);
                tempoFrascoText = `${horasInt}h ${minutos}min (${horas.toFixed(1)} horas)`;
                tempoFrascoItem.style.display = 'block';
            } else {
                tempoFrascoItem.style.display = 'none';
            }
            
            // Calcula goteiras por minuto
            const goteiras = (taxaMLh * 20) / 60; // 1 mL = 20 goteiras
            const goteirasArredondadas = Math.round(goteiras * 10) / 10;
            goteirasMinDiv.textContent = `${goteirasArredondadas} gts/min`;
            goteirasItem.style.display = 'block';
            
            // Exibe resultados
            taxaInfusaoDiv.textContent = `${taxaMLh} mL/h`;
            doseHoraDiv.textContent = doseHoraText;
            tempoFrascoDiv.textContent = tempoFrascoText;
            
            // Mostra resultado
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Função para limpar resultado
        function clearResult() {
            resultDiv.style.display = 'none';
        }
        
        // Adiciona evento para limpar ao clicar nos inputs
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', clearResult);
        });
// ── Firefox MV2 event delegation (replaces inline onclick) ─────────────────
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-fn]').forEach(function (el) {
    var fn  = el.getAttribute('data-fn');
    var arg = el.getAttribute('data-arg');
    el.addEventListener('click', function (e) {
      if (typeof window[fn] === 'function') {
        arg !== null ? window[fn](e, arg) : window[fn]();
      }
    });
  });
});
