/**
 * Manipulação de DOM e eventos para a calculadora de água livre
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */

import { state, updateInput } from './state.js';

// Elementos do DOM
const form = document.getElementById('waterDeficitForm');
const resultDiv = document.getElementById('result');
const deficitValueElement = document.getElementById('deficitValue');
const deficitDescriptionElement = document.getElementById('deficitDescription');
const waterVolumeElement = document.getElementById('waterVolume');
const waterVolumeRow = waterVolumeElement.closest('p');
const correctionRateElement = document.getElementById('correctionRate');

/**
 * Atualiza o DOM com os valores do estado
 */
function updateDOM() {
  // Atualiza inputs (para refletir mudanças programáticas)
  document.getElementById('sodium').value = state.inputs.sodium;
  document.getElementById('desiredSodium').value = state.inputs.desiredSodium;
  document.getElementById('weight').value = state.inputs.weight;
  document.getElementById('age').value = state.inputs.age;
  document.getElementById('gender').value = state.inputs.gender;

  // Atualiza outputs
  if (state.outputs.waterDeficitLiters !== null) {
    const roundedDeficitL = Math.round(state.outputs.waterDeficitLiters * 100) / 100;
    const roundedDeficitML = Math.round(state.outputs.waterDeficitML * 100) / 100;
    deficitValueElement.textContent = `${roundedDeficitL} L (${roundedDeficitML} mL)`;

    // Determina a descrição com base no resultado
    let descriptionText = '';
    let volumeText = '';
    let correctionText = '';

    if (state.inputs.sodium < state.inputs.desiredSodium) {
      // Hiponatremia: resultado negativo (possível sobrecarga hídrica)
      descriptionText = `Excesso de água livre: <strong>Hiponatremia (Na⁺ ${state.inputs.sodium} < ${state.inputs.desiredSodium})</strong>`;
      waterVolumeRow.style.display = 'none';
      volumeText = ``;
      correctionText = `⚠️ Correção máxima recomendada: até ${state.outputs.maxCorrectionRate} mEq/L nas primeiras 24 horas (${state.outputs.correctionPercentage.toFixed(1)}% do déficit total).`;
    } else if (state.inputs.sodium > state.inputs.desiredSodium) {
      // Hipernatremia: déficit positivo (precisa adicionar água)
      descriptionText = `Déficit de água livre: <strong>Hipernatremia (Na⁺ ${state.inputs.sodium} > ${state.inputs.desiredSodium})</strong>`;
      waterVolumeRow.style.display = 'block';
      volumeText = `${Math.abs(roundedDeficitML)} mL de água livre a ser reposta (Solução glicosada 5%)`;
      correctionText = `⚠️ Correção máxima recomendada: reduzir até ${state.outputs.maxCorrectionRate} mEq/L nas primeiras 24 horas (${state.outputs.correctionPercentage.toFixed(1)}% do excesso total).`;
    } else {
      descriptionText = `Sódio dentro do alvo (Na⁺ = ${state.inputs.sodium} mEq/L)`;
      volumeText = `Nenhum déficit`;
      correctionText = ``;
    }

    deficitDescriptionElement.innerHTML = descriptionText;
    waterVolumeElement.textContent = volumeText;
    correctionRateElement.innerHTML = correctionText;

    // Mostra o resultado
    resultDiv.style.display = 'block';
  }
}

/**
 * Função para limpar o resultado
 */
function clearResult() {
  resultDiv.style.display = 'none';
}

// Evento de submit do formulário
form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Atualiza todos os inputs do formulário
  updateInput('sodium', parseFloat(document.getElementById('sodium').value) || 0);
  updateInput('desiredSodium', parseFloat(document.getElementById('desiredSodium').value) || 0);
  updateInput('weight', parseFloat(document.getElementById('weight').value) || 0);
  updateInput('age', parseInt(document.getElementById('age').value) || 0);
  updateInput('gender', document.getElementById('gender').value);
  
  // Atualiza o DOM
  updateDOM();
  
  // Rola a tela até o resultado
  resultDiv.scrollIntoView({ behavior: 'smooth' });
});

// Adiciona evento para limpar ao clicar nos inputs
const inputs = form.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('focus', clearResult);
});

// Inicializa o DOM
updateDOM();
