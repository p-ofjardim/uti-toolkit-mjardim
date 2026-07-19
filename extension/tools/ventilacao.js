/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
// ── Helpers para evitar innerHTML com valores dinâmicos (Firefox MV2) ────────
function setError(id, msg) {
    document.getElementById(id).textContent = msg;
}
function setResult(id, label, value, extra) {
    var el = document.getElementById(id);
    el.textContent = '';
    var lbl = document.createElement('span');
    lbl.className = 'result-label';
    lbl.textContent = label;
    var val = document.createElement('span');
    val.className = 'result-value';
    val.textContent = value;
    el.appendChild(lbl);
    el.append(' ');
    el.appendChild(val);
    if (extra) el.append(extra);
}

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
                setError('ve-result', '❌ Preencha todos os campos');
                return;
            }
            
            const ve = (vt * fr) / 1000;
            setResult('ve-result', 'Volume Minuto:', ve.toFixed(1) + ' L/min');
        }

        function calcIE() {
            const tinsp = parseFloat(document.getElementById('ie-tinsp').value);
            const fr = parseFloat(document.getElementById('ie-fr').value);
            
            if (isNaN(tinsp) || isNaN(fr)) {
                setError('ie-result', '❌ Preencha todos os campos');
                return;
            }
            
            const ttotal = 60 / fr;
            if (ttotal <= tinsp) {
                setError('ie-result', '❌ Tinsp não pode ser ≥ Ttotal');
                return;
            }
            
            const ie = (ttotal - tinsp) / tinsp;
            setResult('ie-result', 'Relação I:E:', '1:' + ie.toFixed(1));
        }

        function calcComplacencia() {
            const vt = parseFloat(document.getElementById('c-vt').value);
            const pplat = parseFloat(document.getElementById('c-pplat').value);
            const peep = parseFloat(document.getElementById('c-peep').value);
            
            if (isNaN(vt) || isNaN(pplat) || isNaN(peep)) {
                setError('c-result', '❌ Preencha todos os campos');
                return;
            }
            
            const deltaP = pplat - peep;
            if (deltaP <= 0) {
                setError('c-result', '❌ Pplat deve ser > PEEP');
                return;
            }
            
            const c = vt / deltaP;
            setResult('c-result', 'Complacência:', c.toFixed(1) + ' mL/cmH₂O');
        }

        function calcResistencia() {
            const ppeak = parseFloat(document.getElementById('r-ppeak').value);
            const pplat = parseFloat(document.getElementById('r-pplat').value);
            const fluxo = parseFloat(document.getElementById('r-fluxo').value);
            
            if (isNaN(ppeak) || isNaN(pplat) || isNaN(fluxo)) {
                setError('r-result', '❌ Preencha todos os campos');
                return;
            }
            
            const deltaP = ppeak - pplat;
            if (deltaP < 0) {
                setError('r-result', '❌ Ppeak deve ser ≥ Pplat');
                return;
            }
            
            const r = deltaP / fluxo;
            setResult('r-result', 'Resistência:', r.toFixed(1) + ' cmH₂O/L/s');
        }

        function calcDrivingPressure() {
            const pplat = parseFloat(document.getElementById('dp-pplat').value);
            const peep = parseFloat(document.getElementById('dp-peep').value);
            
            if (isNaN(pplat) || isNaN(peep)) {
                setError('dp-result', '❌ Preencha todos os campos');
                return;
            }
            
            const dp = pplat - peep;
            let interpretation = '';
            if (dp < 15) interpretation = ' ✅ (Meta: < 15 cmH₂O)';
            else if (dp < 20) interpretation = ' ⚠️ (Elevado)';
            else interpretation = ' ❌ (Muito elevado)';
            
            setResult('dp-result', 'Driving Pressure:', dp.toFixed(1) + ' cmH₂O', interpretation);
        }

        function calcVolumePesoIdeal() {
            const pi = parseFloat(document.getElementById('vtpi-pi').value);
            
            if (isNaN(pi)) {
                setError('vtpi-result', '❌ Preencha o campo');
                return;
            }
            
            const min = 6 * pi;
            const max = 8 * pi;
            setResult('vtpi-result', 'Volume Corrente:', min.toFixed(0) + '-' + max.toFixed(0) + ' mL');
        }

        // ===== CÁLCULOS PESO =====
        function calcPesoIdealHomem() {
            const altura = parseFloat(document.getElementById('pih-altura').value);
            
            if (isNaN(altura)) {
                setError('pih-result', '❌ Preencha o campo');
                return;
            }
            
            const pi = 50 + 0.91 * (altura - 152.4);
            setResult('pih-result', 'Peso Ideal:', pi.toFixed(1) + ' kg');
        }

        function calcPesoIdealMulher() {
            const altura = parseFloat(document.getElementById('pim-altura').value);
            
            if (isNaN(altura)) {
                setError('pim-result', '❌ Preencha o campo');
                return;
            }
            
            const pi = 45.5 + 0.91 * (altura - 152.4);
            setResult('pim-result', 'Peso Ideal:', pi.toFixed(1) + ' kg');
        }

        // ===== CÁLCULOS GASOMETRIA =====
        function calcPF() {
            const pao2 = parseFloat(document.getElementById('pf-pao2').value);
            const fio2 = parseFloat(document.getElementById('pf-fio2').value);
            
            if (isNaN(pao2) || isNaN(fio2) || fio2 <= 0) {
                setError('pf-result', '❌ Preencha todos os campos');
                return;
            }
            
            const pf = pao2 / fio2;
            let interpretation = '';
            if (pf > 400) interpretation = ' ✅ (Normal)';
            else if (pf >= 200) interpretation = ' ⚠️ (SARA leve)';
            else if (pf >= 100) interpretation = ' ❌ (SARA moderada)';
            else interpretation = ' ❌ (SARA grave)';
            
            setResult('pf-result', 'P/F Ratio:', pf.toFixed(0), interpretation);
        }

        function calcPaCO2Esperado() {
            const hco3 = parseFloat(document.getElementById('paco2e-hco3').value);
            
            if (isNaN(hco3)) {
                setError('paco2e-result', '❌ Preencha o campo');
                return;
            }
            
            const paco2 = 1.5 * hco3 + 8;
            setResult('paco2e-result', 'PaCO₂ Esperado:', paco2.toFixed(0) + ' ± 2 mmHg');
        }

        function calcHCO3Esperado() {
            const deltaPaco2 = parseFloat(document.getElementById('hco3e-delta').value);
            
            if (isNaN(deltaPaco2)) {
                setError('hco3e-result', '❌ Preencha o campo');
                return;
            }
            
            const deltaHCO3 = 0.35 * deltaPaco2;
            setResult('hco3e-result', 'ΔHCO₃⁻:', '+' + deltaHCO3.toFixed(1) + ' mEq/L');
        }

        // ===== CÁLCULOS AJUSTES =====
        function calcAjusteFR() {
            const fr = parseFloat(document.getElementById('afr-fr').value);
            const paco2 = parseFloat(document.getElementById('afr-paco2').value);
            const paco2d = parseFloat(document.getElementById('afr-paco2d').value);
            
            if (isNaN(fr) || isNaN(paco2) || isNaN(paco2d) || paco2d <= 0) {
                setError('afr-result', '❌ Preencha todos os campos');
                return;
            }
            
            const frNova = fr * (paco2 / paco2d);
            setResult('afr-result', 'FR Ajustada:', frNova.toFixed(1) + ' irpm');
        }

        function calcAjusteVT() {
            const vt = parseFloat(document.getElementById('avt-vt').value);
            const paco2d = parseFloat(document.getElementById('avt-paco2d').value);
            const paco2 = parseFloat(document.getElementById('avt-paco2').value);
            
            if (isNaN(vt) || isNaN(paco2d) || isNaN(paco2) || paco2 <= 0) {
                setError('avt-result', '❌ Preencha todos os campos');
                return;
            }
            
            const vtNovo = vt * (paco2 / paco2d);
            setResult('avt-result', 'VT Ajustado:', vtNovo.toFixed(0) + ' mL');
        }

        function calcAjusteVE() {
            const ve = parseFloat(document.getElementById('ave-ve').value);
            const paco2 = parseFloat(document.getElementById('ave-paco2').value);
            const paco2d = parseFloat(document.getElementById('ave-paco2d').value);
            
            if (isNaN(ve) || isNaN(paco2) || isNaN(paco2d) || paco2d <= 0) {
                setError('ave-result', '❌ Preencha todos os campos');
                return;
            }
            
            const veNovo = ve * (paco2 / paco2d);
            setResult('ave-result', 'VE Ajustado:', veNovo.toFixed(1) + ' L/min');
        }

        // ===== CÁLCULOS DESMAME =====
        function calcRSBI() {
            const fr = parseFloat(document.getElementById('rsbi-fr').value);
            const vt = parseFloat(document.getElementById('rsbi-vt').value);
            
            if (isNaN(fr) || isNaN(vt) || vt <= 0) {
                setError('rsbi-result', '❌ Preencha todos os campos');
                return;
            }
            
            const rsbi = fr / (vt / 1000);
            let interpretation = '';
            if (rsbi < 105) interpretation = ' ✅ (Sucesso provável)';
            else interpretation = ' ❌ (Falha provável)';
            
            setResult('rsbi-result', 'RSBI:', rsbi.toFixed(1) + ' respirações/min/L', interpretation);
        }

        function calcCROP() {
            const cdin = parseFloat(document.getElementById('crop-cdin').value);
            const pimax = parseFloat(document.getElementById('crop-pimax').value);
            const pao2 = parseFloat(document.getElementById('crop-pao2').value);
            const paco2 = parseFloat(document.getElementById('crop-paco2').value);
            const fr = parseFloat(document.getElementById('crop-fr').value);
            
            if (isNaN(cdin) || isNaN(pimax) || isNaN(pao2) || isNaN(paco2) || isNaN(fr) || paco2 <= 0 || fr <= 0) {
                setError('crop-result', '❌ Preencha todos os campos');
                return;
            }
            
            const crop = (cdin * pimax * (pao2 / paco2)) / fr;
            let interpretation = '';
            if (crop > 15) interpretation = ' ✅ (Sucesso provável)';
            else if (crop > 13) interpretation = ' ⚠️ (Inconclusivo)';
            else interpretation = ' ❌ (Falha provável)';
            
            setResult('crop-result', 'CROP Index:', crop.toFixed(1), interpretation);
        }

        function calcVTEsp() {
            const ve = parseFloat(document.getElementById('vtesp-ve').value);
            const fr = parseFloat(document.getElementById('vtesp-fr').value);
            
            if (isNaN(ve) || isNaN(fr) || fr <= 0) {
                setError('vtesp-result', '❌ Preencha todos os campos');
                return;
            }
            
            const vt = (ve * 1000) / fr;
            setResult('vtesp-result', 'VT Espontâneo:', vt.toFixed(0) + ' mL');
        }

        function calcVEEsp() {
            const vt = parseFloat(document.getElementById('veesp-vt').value);
            const fr = parseFloat(document.getElementById('veesp-fr').value);
            
            if (isNaN(vt) || isNaN(fr)) {
                setError('veesp-result', '❌ Preencha todos os campos');
                return;
            }
            
            const ve = (vt * fr) / 1000;
            setResult('veesp-result', 'VE Espontânea:', ve.toFixed(1) + ' L/min');
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
                resultDiv.textContent = '✅ Paciente PRONTO para SBT';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.textContent = '❌ Paciente NÃO está pronto para SBT';
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
                resultDiv.textContent = '✅ Paciente TOLEROU SBT - Extubar';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.textContent = '❌ Paciente NÃO tolerou SBT';
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
                resultDiv.textContent = '✅ Fatores do paciente FAVORÁVEIS para extubação';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.textContent = '⚠️ Alguns fatores NÃO favoráveis';
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
                resultDiv.textContent = '✅ NENHUMA contraindicação para extubação';
                resultDiv.className = 'checklist-result ok';
            } else {
                resultDiv.textContent = '❌ CONTRAINDICAÇÃO para extubação';
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
