// Função para trocar abas
        function openTab(evt, tabName) {
            const tabs = document.querySelectorAll('.tab');
            const buttons = document.querySelectorAll('.tab-button');
            
            tabs.forEach(tab => tab.style.display = 'none');
            buttons.forEach(button => button.classList.remove('active'));
            
            document.getElementById(tabName).style.display = 'block';
            evt.currentTarget.classList.add('active');
        }

        // Função para copiar resultado
        function copyResult(elementId) {
            const text = document.getElementById(elementId).innerText;
            if (!text || text.includes('Preencha')) {
                alert('Nenhum resultado para copiar');
                return;
            }
            navigator.clipboard.writeText(text).then(() => {
                alert('Resultado copiado para a área de transferência!');
            }).catch(err => {
                alert('Erro ao copiar: ' + err);
            });
        }

        // ===== CÁLCULOS VENTILAÇÃO =====
        function calcVE() {
            const vt = parseFloat(document.getElementById('ve-vt').value);
            const fr = parseFloat(document.getElementById('ve-fr').value);
            
            if (isNaN(vt) || isNaN(fr)) {
                document.getElementById('ve-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const ve = (vt * fr) / 1000;
            document.getElementById('ve-result').innerHTML = 
                `<span class="result-label">Volume Minuto:</span> <span class="result-value">${ve.toFixed(1)} L/min</span>`;
        }

        function calcIE() {
            const tinsp = parseFloat(document.getElementById('ie-tinsp').value);
            const fr = parseFloat(document.getElementById('ie-fr').value);
            
            if (isNaN(tinsp) || isNaN(fr)) {
                document.getElementById('ie-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const ttotal = 60 / fr; // Ttotal em segundos
            if (ttotal <= tinsp) {
                document.getElementById('ie-result').innerHTML = '❌ Tinsp não pode ser ≥ Ttotal';
                return;
            }
            
            // Fórmula correta: I:E = 1 : Texp/Tinsp
            const ie = (ttotal - tinsp) / tinsp;
            document.getElementById('ie-result').innerHTML = 
                `<span class="result-label">Relação I:E:</span> <span class="result-value">1:${ie.toFixed(1)}</span>`;
        }

        function calcComplacencia() {
            const vt = parseFloat(document.getElementById('c-vt').value);
            const pplat = parseFloat(document.getElementById('c-pplat').value);
            const peep = parseFloat(document.getElementById('c-peep').value);
            
            if (isNaN(vt) || isNaN(pplat) || isNaN(peep)) {
                document.getElementById('c-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const deltaP = pplat - peep;
            if (deltaP <= 0) {
                document.getElementById('c-result').innerHTML = '❌ Pplat deve ser > PEEP';
                return;
            }
            
            const c = vt / deltaP;
            document.getElementById('c-result').innerHTML = 
                `<span class="result-label">Complacência:</span> <span class="result-value">${c.toFixed(1)} mL/cmH₂O</span>`;
        }

        function calcResistencia() {
            const ppeak = parseFloat(document.getElementById('r-ppeak').value);
            const pplat = parseFloat(document.getElementById('r-pplat').value);
            const fluxo = parseFloat(document.getElementById('r-fluxo').value);
            
            if (isNaN(ppeak) || isNaN(pplat) || isNaN(fluxo)) {
                document.getElementById('r-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const deltaP = ppeak - pplat;
            if (deltaP < 0) {
                document.getElementById('r-result').innerHTML = '❌ Ppeak deve ser ≥ Pplat';
                return;
            }
            
            // Fluxo deve estar em L/s (não L/min)
            const r = deltaP / fluxo;
            document.getElementById('r-result').innerHTML = 
                `<span class="result-label">Resistência:</span> <span class="result-value">${r.toFixed(1)} cmH₂O/L/s</span>`;
        }

        function calcDrivingPressure() {
            const pplat = parseFloat(document.getElementById('dp-pplat').value);
            const peep = parseFloat(document.getElementById('dp-peep').value);
            
            if (isNaN(pplat) || isNaN(peep)) {
                document.getElementById('dp-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const dp = pplat - peep;
            let interpretation = '';
            if (dp < 15) interpretation = ' ✅ (Meta: < 15 cmH₂O)';
            else if (dp < 20) interpretation = ' ⚠️ (Elevado)';
            else interpretation = ' ❌ (Muito elevado)';
            
            document.getElementById('dp-result').innerHTML = 
                `<span class="result-label">Driving Pressure:</span> <span class="result-value">${dp.toFixed(1)} cmH₂O</span>${interpretation}`;
        }

        function calcVolumePesoIdeal() {
            const pi = parseFloat(document.getElementById('vtpi-pi').value);
            
            if (isNaN(pi)) {
                document.getElementById('vtpi-result').innerHTML = '❌ Preencha o campo';
                return;
            }
            
            const min = 6 * pi;
            const max = 8 * pi;
            document.getElementById('vtpi-result').innerHTML = 
                `<span class="result-label">Volume Corrente:</span> <span class="result-value">${min.toFixed(0)}-${max.toFixed(0)} mL</span>`;
        }

        // ===== CÁLCULOS PESO =====
        function calcPesoIdealHomem() {
            const altura = parseFloat(document.getElementById('pih-altura').value);
            
            if (isNaN(altura)) {
                document.getElementById('pih-result').innerHTML = '❌ Preencha o campo';
                return;
            }
            
            const pi = 50 + 0.91 * (altura - 152.4);
            document.getElementById('pih-result').innerHTML = 
                `<span class="result-label">Peso Ideal:</span> <span class="result-value">${pi.toFixed(1)} kg</span>`;
        }

        function calcPesoIdealMulher() {
            const altura = parseFloat(document.getElementById('pim-altura').value);
            
            if (isNaN(altura)) {
                document.getElementById('pim-result').innerHTML = '❌ Preencha o campo';
                return;
            }
            
            const pi = 45.5 + 0.91 * (altura - 152.4);
            document.getElementById('pim-result').innerHTML = 
                `<span class="result-label">Peso Ideal:</span> <span class="result-value">${pi.toFixed(1)} kg</span>`;
        }

        // ===== CÁLCULOS GASOMETRIA =====
        function calcPF() {
            const pao2 = parseFloat(document.getElementById('pf-pao2').value);
            const fio2 = parseFloat(document.getElementById('pf-fio2').value);
            
            if (isNaN(pao2) || isNaN(fio2) || fio2 <= 0) {
                document.getElementById('pf-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const pf = pao2 / fio2;
            let interpretation = '';
            if (pf > 400) interpretation = ' ✅ (Normal)';
            else if (pf >= 200) interpretation = ' ⚠️ (SARA leve)';
            else if (pf >= 100) interpretation = ' ❌ (SARA moderada)';
            else interpretation = ' ❌ (SARA grave)';
            
            document.getElementById('pf-result').innerHTML = 
                `<span class="result-label">P/F Ratio:</span> <span class="result-value">${pf.toFixed(0)}</span>${interpretation}`;
        }

        function calcPaCO2Esperado() {
            const hco3 = parseFloat(document.getElementById('paco2e-hco3').value);
            
            if (isNaN(hco3)) {
                document.getElementById('paco2e-result').innerHTML = '❌ Preencha o campo';
                return;
            }
            
            const paco2 = 1.5 * hco3 + 8;
            document.getElementById('paco2e-result').innerHTML = 
                `<span class="result-label">PaCO₂ Esperado:</span> <span class="result-value">${paco2.toFixed(0)} ± 2 mmHg</span>`;
        }

        function calcHCO3Esperado() {
            const deltaPaco2 = parseFloat(document.getElementById('hco3e-delta').value);
            
            if (isNaN(deltaPaco2)) {
                document.getElementById('hco3e-result').innerHTML = '❌ Preencha o campo';
                return;
            }
            
            const deltaHCO3 = 0.35 * deltaPaco2;
            document.getElementById('hco3e-result').innerHTML = 
                `<span class="result-label">ΔHCO₃⁻:</span> <span class="result-value">+${deltaHCO3.toFixed(1)} mEq/L</span>`;
        }

        // ===== CÁLCULOS AJUSTES =====
        function calcAjusteFR() {
            const fr = parseFloat(document.getElementById('afr-fr').value);
            const paco2 = parseFloat(document.getElementById('afr-paco2').value);
            const paco2d = parseFloat(document.getElementById('afr-paco2d').value);
            
            if (isNaN(fr) || isNaN(paco2) || isNaN(paco2d) || paco2d <= 0) {
                document.getElementById('afr-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const frNova = fr * (paco2 / paco2d);
            document.getElementById('afr-result').innerHTML = 
                `<span class="result-label">FR Ajustada:</span> <span class="result-value">${frNova.toFixed(1)} irpm</span>`;
        }

        function calcAjusteVT() {
            const vt = parseFloat(document.getElementById('avt-vt').value);
            const paco2d = parseFloat(document.getElementById('avt-paco2d').value);
            const paco2 = parseFloat(document.getElementById('avt-paco2').value);
            
            if (isNaN(vt) || isNaN(paco2d) || isNaN(paco2) || paco2 <= 0) {
                document.getElementById('avt-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const vtNovo = vt * (paco2 / paco2d);
            document.getElementById('avt-result').innerHTML = 
                `<span class="result-label">VT Ajustado:</span> <span class="result-value">${vtNovo.toFixed(0)} mL</span>`;
        }

        function calcAjusteVE() {
            const ve = parseFloat(document.getElementById('ave-ve').value);
            const paco2 = parseFloat(document.getElementById('ave-paco2').value);
            const paco2d = parseFloat(document.getElementById('ave-paco2d').value);
            
            if (isNaN(ve) || isNaN(paco2) || isNaN(paco2d) || paco2d <= 0) {
                document.getElementById('ave-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const veNovo = ve * (paco2 / paco2d);
            document.getElementById('ave-result').innerHTML = 
                `<span class="result-label">VE Ajustado:</span> <span class="result-value">${veNovo.toFixed(1)} L/min</span>`;
        }

        // ===== CÁLCULOS DESMAME =====
        function calcRSBI() {
            const fr = parseFloat(document.getElementById('rsbi-fr').value);
            const vt = parseFloat(document.getElementById('rsbi-vt').value);
            
            if (isNaN(fr) || isNaN(vt) || vt <= 0) {
                document.getElementById('rsbi-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const rsbi = fr / (vt / 1000);
            let interpretation = '';
            if (rsbi < 105) interpretation = ' ✅ (Sucesso provável)';
            else interpretation = ' ❌ (Falha provável)';
            
            document.getElementById('rsbi-result').innerHTML = 
                `<span class="result-label">RSBI:</span> <span class="result-value">${rsbi.toFixed(1)} respirações/min/L</span>${interpretation}`;
        }

        function calcCROP() {
            const cdin = parseFloat(document.getElementById('crop-cdin').value);
            const pimax = parseFloat(document.getElementById('crop-pimax').value);
            const pao2 = parseFloat(document.getElementById('crop-pao2').value);
            const paco2 = parseFloat(document.getElementById('crop-paco2').value);
            const fr = parseFloat(document.getElementById('crop-fr').value);
            
            if (isNaN(cdin) || isNaN(pimax) || isNaN(pao2) || isNaN(paco2) || isNaN(fr) || paco2 <= 0 || fr <= 0) {
                document.getElementById('crop-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const crop = (cdin * pimax * (pao2 / paco2)) / fr;
            let interpretation = '';
            if (crop > 15) interpretation = ' ✅ (Sucesso provável)';
            else if (crop > 13) interpretation = ' ⚠️ (Inconclusivo)';
            else interpretation = ' ❌ (Falha provável)';
            
            document.getElementById('crop-result').innerHTML = 
                `<span class="result-label">CROP Index:</span> <span class="result-value">${crop.toFixed(1)}</span>${interpretation}`;
        }

        function calcVTEsp() {
            const ve = parseFloat(document.getElementById('vtesp-ve').value);
            const fr = parseFloat(document.getElementById('vtesp-fr').value);
            
            if (isNaN(ve) || isNaN(fr) || fr <= 0) {
                document.getElementById('vtesp-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const vt = (ve * 1000) / fr;
            document.getElementById('vtesp-result').innerHTML = 
                `<span class="result-label">VT Espontâneo:</span> <span class="result-value">${vt.toFixed(0)} mL</span>`;
        }

        function calcVEEsp() {
            const vt = parseFloat(document.getElementById('veesp-vt').value);
            const fr = parseFloat(document.getElementById('veesp-fr').value);
            
            if (isNaN(vt) || isNaN(fr)) {
                document.getElementById('veesp-result').innerHTML = '❌ Preencha todos os campos';
                return;
            }
            
            const ve = (vt * fr) / 1000;
            document.getElementById('veesp-result').innerHTML = 
                `<span class="result-label">VE Espontânea:</span> <span class="result-value">${ve.toFixed(1)} L/min</span>`;
        }

        // ===== CHECKLISTS =====
        function verificarProntidao() {
            const checks = [
                'pront-pf', 'pront-peep', 'pront-fio2', 'pront-ph', 
                'pront-hemo', 'pront-sed', 'pront-tosse'
            ];
            const allChecked = checks.every(id => document.getElementById(id).checked);
            
            const resultDiv = document.getElementById('prontidao-result');
            if (allChecked) {
                resultDiv.innerHTML = '✅ Paciente PRONTO para SBT';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.innerHTML = '❌ Paciente NÃO está pronto para SBT';
                resultDiv.className = 'checklist-result not-ok';
            }
        }

        function verificarTolerancia() {
            const checks = [
                'tol-fr', 'tol-vt', 'tol-sato2', 'tol-fc', 
                'tol-pas', 'tol-diaforese', 'tol-ansiedade', 'tol-ph'
            ];
            const allChecked = checks.every(id => document.getElementById(id).checked);
            
            const resultDiv = document.getElementById('tolerancia-result');
            if (allChecked) {
                resultDiv.innerHTML = '✅ Paciente TOLEROU SBT - Extubar';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.innerHTML = '❌ Paciente NÃO tolerou SBT';
                resultDiv.className = 'checklist-result not-ok';
            }
        }

        function verificarFatores() {
            const checks = [
                'fator-va', 'fator-tosse', 'fator-secrecoes', 
                'fator-nivel', 'fator-forca'
            ];
            const allChecked = checks.every(id => document.getElementById(id).checked);
            
            const resultDiv = document.getElementById('fatores-result');
            if (allChecked) {
                resultDiv.innerHTML = '✅ Fatores do paciente FAVORÁVEIS para extubação';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.innerHTML = '⚠️ Alguns fatores NÃO favoráveis';
                resultDiv.className = 'checklist-result not-ok';
            }
        }

        function verificarContraindicacoes() {
            const checks = [
                'contra-coma', 'contra-hemo', 'contra-hipox', 
                'contra-acidose', 'contra-sang'
            ];
            const anyChecked = checks.some(id => document.getElementById(id).checked);
            
            const resultDiv = document.getElementById('contra-result');
            if (!anyChecked) {
                resultDiv.innerHTML = '✅ NENHUMA contraindicação para extubação';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.innerHTML = '❌ CONTRAINDICAÇÃO para extubação';
                resultDiv.className = 'checklist-result not-ok';
            }
        }

        // Abrir a primeira aba por padrão
        window.onload = function() {
            document.querySelector('.tab-button').classList.add('active');
            document.getElementById('ventilacao').style.display = 'block';
        };
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
