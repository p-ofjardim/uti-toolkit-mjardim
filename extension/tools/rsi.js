/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
// Mostrar aba selecionada
        function showTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            calcularDoses();
        }
        
        // Copiar resultado
        function copyResult() {
            const text = document.getElementById('resultado').value;
            if (!text || text.trim() === '') {
                alert('Nenhum texto para copiar');
                return;
            }
            navigator.clipboard.writeText(text).then(() => {
                alert('Texto copiado para a área de transferência!');
            }).catch(err => {
                alert('Erro ao copiar: ' + err);
            });
        }
        
        // Função para calcular todas as doses
        function calcularDoses() {
            const peso = parseFloat(document.getElementById('peso').value) || 0;
            
            if (peso <= 0) {
                document.getElementById('resultado').value = 'Informe o peso do paciente.';
                return;
            }
            
            // Agentes de Indução
            const resultados = [];
            
            // Etomidato
            const etomidateConc = parseFloat(document.getElementById('etomidate-conc').value) || 2;
            const etomidateDose = 0.3 * peso;
            const etomidateVol = etomidateDose / etomidateConc;
            document.getElementById('etomidate-result').value = `${etomidateDose.toFixed(1)} mg (${etomidateVol.toFixed(1)} mL)`;
            
            // Cetamina
            const ketamineDose = parseFloat(document.getElementById('ketamine-dose').value) || 1;
            const ketamineConc = parseFloat(document.getElementById('ketamine-conc').value) || 10;
            const ketamineTotal = ketamineDose * peso;
            const ketamineVol = ketamineTotal / ketamineConc;
            document.getElementById('ketamine-result').value = `${ketamineTotal.toFixed(1)} mg (${ketamineVol.toFixed(1)} mL)`;
            
            // Propofol
            const propofolDose = parseFloat(document.getElementById('propofol-dose').value) || 1;
            const propofolConc = parseFloat(document.getElementById('propofol-conc').value) || 10;
            const propofolTotal = propofolDose * peso;
            const propofolVol = propofolTotal / propofolConc;
            document.getElementById('propofol-result').value = `${propofolTotal.toFixed(1)} mg (${propofolVol.toFixed(1)} mL)`;
            
            // Midazolam
            const midazolamDose = parseFloat(document.getElementById('midazolam-dose').value) || 0.1;
            const midazolamConc = parseFloat(document.getElementById('midazolam-conc').value) || 1;
            const midazolamTotal = midazolamDose * peso;
            const midazolamVol = midazolamTotal / midazolamConc;
            document.getElementById('midazolam-result').value = `${midazolamTotal.toFixed(1)} mg (${midazolamVol.toFixed(1)} mL)`;
            
            // Metohexital
            const methohexitalConc = parseFloat(document.getElementById('methohexital-conc').value) || 10;
            const methohexitalTotal = 1.5 * peso;
            const methohexitalVol = methohexitalTotal / methohexitalConc;
            document.getElementById('methohexital-result').value = `${methohexitalTotal.toFixed(1)} mg (${methohexitalVol.toFixed(1)} mL)`;
            
            // Tiopental
            const thiopentalDose = parseFloat(document.getElementById('thiopental-dose').value) || 3;
            const thiopentalConc = parseFloat(document.getElementById('thiopental-conc').value) || 25;
            const thiopentalTotal = thiopentalDose * peso;
            const thiopentalVol = thiopentalTotal / thiopentalConc;
            document.getElementById('thiopental-result').value = `${thiopentalTotal.toFixed(1)} mg (${thiopentalVol.toFixed(1)} mL)`;
            
            // Bloqueadores Neuromusculares
            
            // Succinilcolina
            const succinylcholineConc = parseFloat(document.getElementById('succinylcholine-conc').value) || 20;
            const succinylcholineTotal = 1.5 * peso;
            const succinylcholineVol = succinylcholineTotal / succinylcholineConc;
            document.getElementById('succinylcholine-result').value = `${succinylcholineTotal.toFixed(1)} mg (${succinylcholineVol.toFixed(1)} mL)`;
            
            // Rocurônio
            const rocuroniumDose = parseFloat(document.getElementById('rocuronium-dose').value) || 0.6;
            const rocuroniumConc = parseFloat(document.getElementById('rocuronium-conc').value) || 10;
            const rocuroniumTotal = rocuroniumDose * peso;
            const rocuroniumVol = rocuroniumTotal / rocuroniumConc;
            document.getElementById('rocuronium-result').value = `${rocuroniumTotal.toFixed(1)} mg (${rocuroniumVol.toFixed(1)} mL)`;
            
            // Vecurônio
            const vecuroniumDose = parseFloat(document.getElementById('vecuronium-dose').value) || 0.1;
            const vecuroniumConc = parseFloat(document.getElementById('vecuronium-conc').value) || 10;
            const vecuroniumTotal = vecuroniumDose * peso;
            const vecuroniumVol = vecuroniumTotal / vecuroniumConc;
            document.getElementById('vecuronium-result').value = `${vecuroniumTotal.toFixed(1)} mg (${vecuroniumVol.toFixed(1)} mL)`;
            
            // Gerar texto de resultado
            let textoResultado = `Cálculo para paciente de ${peso} kg:\n\n`;
            
            const abaAtiva = document.querySelector('.tab.active').textContent;
            
            if (abaAtiva.includes('Indução')) {
                textoResultado += "=== AGENTES DE INDUÇÃO ===\n";
                textoResultado += `• Etomidato: ${etomidateDose.toFixed(1)} mg (${etomidateVol.toFixed(1)} mL de solução a ${etomidateConc} mg/mL)\n`;
                textoResultado += `• Cetamina: ${ketamineTotal.toFixed(1)} mg (${ketamineVol.toFixed(1)} mL de solução a ${ketamineConc} mg/mL)\n`;
                textoResultado += `• Propofol: ${propofolTotal.toFixed(1)} mg (${propofolVol.toFixed(1)} mL de solução a ${propofolConc} mg/mL)\n`;
                textoResultado += `• Midazolam: ${midazolamTotal.toFixed(1)} mg (${midazolamVol.toFixed(1)} mL de solução a ${midazolamConc} mg/mL)\n`;
                textoResultado += `• Metohexital: ${methohexitalTotal.toFixed(1)} mg (${methohexitalVol.toFixed(1)} mL de solução a ${methohexitalConc} mg/mL)\n`;
                textoResultado += `• Tiopental: ${thiopentalTotal.toFixed(1)} mg (${thiopentalVol.toFixed(1)} mL de solução a ${thiopentalConc} mg/mL)\n`;
            } else {
                textoResultado += "=== BLOQUEADORES NEUROMUSCULARES ===\n";
                textoResultado += `• Succinilcolina: ${succinylcholineTotal.toFixed(1)} mg (${succinylcholineVol.toFixed(1)} mL de solução a ${succinylcholineConc} mg/mL)\n`;
                textoResultado += `• Rocurônio: ${rocuroniumTotal.toFixed(1)} mg (${rocuroniumVol.toFixed(1)} mL de solução a ${rocuroniumConc} mg/mL)\n`;
                textoResultado += `• Vecurônio: ${vecuroniumTotal.toFixed(1)} mg (${vecuroniumVol.toFixed(1)} mL de solução a ${vecuroniumConc} mg/mL)\n`;
            }
            
            textoResultado += "\n⚠️  Verifique sempre a concentração do frasco antes da administração!";
            
            document.getElementById('resultado').value = textoResultado;
        }
        
        // Inicializar
        window.onload = function() {
            document.getElementById('peso').value = '70';
            calcularDoses();
        };/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
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
