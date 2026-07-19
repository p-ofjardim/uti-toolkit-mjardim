/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
/* ===== CÓDIGO JAVASCRIPT ===== */
        
// 1. Seleciona o formulário e o elemento de resultado
const form = document.getElementById('waterDeficitForm');
const resultDiv = document.getElementById('result');
        
// 2. Adiciona um ouvinte de evento para o submit do formulário
form.addEventListener('submit', function(event) {
    // Previne o comportamento padrão (recarregar a página)
    event.preventDefault();
            
    // 3. Obtém os valores dos inputs
    const sodium = parseFloat(document.getElementById('sodium').value);
    const desiredSodium = parseFloat(document.getElementById('desiredSodium').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value) || 0;
    const gender = document.getElementById('gender').value;
            
    // 4. Define %TBW (Total Body Water) conforme idade e sexo
    let tbw;
    if (age >= 65) {
        // Idoso
        tbw = gender === 'male' ? 0.5 : 0.45;
    } else {
        // Adulto
        tbw = gender === 'male' ? 0.6 : 0.5;
    }
            
    // 5. CÁLCULO PRINCIPAL - Fórmula do NEJM
    // Déficit (L) = %TBW × Peso × (Na_atual / Na_desejado - 1)
    const waterDeficitLiters = tbw * weight * (sodium / desiredSodium - 1);
            
    // 6. Converte para mL (1 L = 1000 mL)
    const waterDeficitML = waterDeficitLiters * 1000;
            
    // 7. Arredonda para 2 casas decimais
    const roundedDeficitL = Math.round(waterDeficitLiters * 100) / 100;
    const roundedDeficitML = Math.round(waterDeficitML * 100) / 100;
            
    // 8. Formata o result
ado
    const resultElement = document.getElementById('deficitValue');
    const descriptionElement = document.getElementById('deficitDescription');
    const waterVolumeElement = document.getElementById('waterVolume');
    const correctionRateElement = document.getElementById('correctionRate');
            
    // 9. Determina a descrição com base no resultado
    let descriptionText = '';
    let volumeText = '';
    let correctionText = '';
            
    if (sodium < desiredSodium) {
        // Hiponatremia: déficit negativo (precisa remover água)
        descriptionText = `Excesso de água livre: <strong>Hiponatremia (Na⁺ ${sodium} < ${desiredSodium})</strong>`;
        volumeText = `${Math.abs(roundedDeficitML)} mL de água livre`;
                
        // Calcula taxa de correção máxima
        const maxCorrection = 10; // 10 mEq/L em 24h
        const currentDeficit = desiredSodium - sodium;
        const correctionPercentage = Math.min((maxCorrection / currentDeficit) * 100, 100);
        correctionText = `⚠️ Correção máxima recomendada: até ${maxCorrection} mEq/L nas primeiras 24 horas (${correctionPercentage.toFixed(1)}% do déficit total).`;
    } else if (sodium > desiredSodium) {
        // Hipernatremia: déficit positivo (precisa adicionar água)
        descriptionText = `Déficit de água livre: <strong>Hipernatremia (Na⁺ ${sodium} > ${desiredSodium})</strong>`;
        volumeText = `${Math.abs(roundedDeficitML)} mL de água livre a ser reposta (Solução glicosada 5%)`;
                
        // Calcula taxa de correção máxima
        const maxCorrection = 10; // 10 mEq/L em 24h
        const currentExcess = sodium - desiredSodium;
        const correctionPercentage = Math.min((maxCorrection / currentExcess) * 100, 100);
        correctionText = 
`⚠️ Correção máxima recomendada: reduzir até ${maxCorrection} mEq/L nas primeiras 24 horas (${correctionPercentage.toFixed(1)}% do excesso total).`;
    } else {
        descriptionText = `Sódio dentro do alvo (Na⁺ = ${sodium} mEq/L)`;
        volumeText = `Nenhum déficit`;
        correctionText = ``;
    }
            
    // 10. Exibe os resultados
    resultElement.textContent = `${roundedDeficitL} L (${roundedDeficitML} mL)`;

    // Monta descriptionElement com DOM (evita innerHTML dinâmico)
    descriptionElement.textContent = '';
    if (sodium < desiredSodium) {
        descriptionElement.append('Excesso de água livre: ');
        const strong = document.createElement('strong');
        strong.textContent = `Hiponatremia (Na⁺ ${sodium} < ${desiredSodium})`;
        descriptionElement.appendChild(strong);
    } else if (sodium > desiredSodium) {
        descriptionElement.append('Déficit de água livre: ');
        const strong = document.createElement('strong');
        strong.textContent = `Hipernatremia (Na⁺ ${sodium} > ${desiredSodium})`;
        descriptionElement.appendChild(strong);
    } else {
        descriptionElement.textContent = `Sódio dentro do alvo (Na⁺ = ${sodium} mEq/L)`;
    }

    waterVolumeElement.textContent = volumeText;
    correctionRateElement.textContent = correctionText;
            
    // 11. Mostra o resultado
    resultDiv.style.display = 'block';
            
    // 12. Rola a tela até o resultado
    resultDiv.scrollIntoView({ behavior: 'smooth' });
});
        
// 13. Função para limpar o resultado (opcional)
function clearResult() {
    resultDiv.style.display = 'none';
}
        
// 14. Adiciona evento para limpar ao clicar nos inputs
const inputs
 = form.querySelectorAll('input');
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
