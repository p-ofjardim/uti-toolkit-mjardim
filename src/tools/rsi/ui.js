/**
 * Manipulação de DOM e eventos para a calculadora RSI
 * Conecta os inputs do usuário ao state e atualiza o DOM com os outputs
 */

import { state, updateInput, calcular, copyResult } from './state.js';

// Função para atualizar o DOM
function updateDOM() {
  // Atualiza peso
  const pesoInput = document.getElementById('peso');
  if (pesoInput) {
    pesoInput.value = state.inputs.peso;
  }

  // Atualiza campos de dose
  const fields = [
    'etomidate-conc', 'ketamine-dose', 'ketamine-conc', 'propofol-dose', 'propofol-conc',
    'midazolam-dose', 'midazolam-conc', 'methohexital-conc', 'thiopental-dose', 'thiopental-conc',
    'succinylcholine-conc', 'rocuronium-dose', 'rocuronium-conc', 'vecuronium-dose', 'vecuronium-conc'
  ];
  
  fields.forEach(field => {
    const element = document.getElementById(field);
    if (element) {
      element.value = state.inputs[field];
    }
  });

  // Atualiza resultados
  if (state.outputs.etomidate) {
    document.getElementById('etomidate-result').value = 
      `${state.outputs.etomidate.doseTotal.toFixed(1)} mg (${state.outputs.etomidate.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.ketamine) {
    document.getElementById('ketamine-result').value = 
      `${state.outputs.ketamine.doseTotal.toFixed(1)} mg (${state.outputs.ketamine.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.propofol) {
    document.getElementById('propofol-result').value = 
      `${state.outputs.propofol.doseTotal.toFixed(1)} mg (${state.outputs.propofol.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.midazolam) {
    document.getElementById('midazolam-result').value = 
      `${state.outputs.midazolam.doseTotal.toFixed(1)} mg (${state.outputs.midazolam.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.methohexital) {
    document.getElementById('methohexital-result').value = 
      `${state.outputs.methohexital.doseTotal.toFixed(1)} mg (${state.outputs.methohexital.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.thiopental) {
    document.getElementById('thiopental-result').value = 
      `${state.outputs.thiopental.doseTotal.toFixed(1)} mg (${state.outputs.thiopental.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.succinylcholine) {
    document.getElementById('succinylcholine-result').value = 
      `${state.outputs.succinylcholine.doseTotal.toFixed(1)} mg (${state.outputs.succinylcholine.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.rocuronium) {
    document.getElementById('rocuronium-result').value = 
      `${state.outputs.rocuronium.doseTotal.toFixed(1)} mg (${state.outputs.rocuronium.volume.toFixed(1)} mL)`;
  }
  if (state.outputs.vecuronium) {
    document.getElementById('vecuronium-result').value = 
      `${state.outputs.vecuronium.doseTotal.toFixed(1)} mg (${state.outputs.vecuronium.volume.toFixed(1)} mL)`;
  }

  // Atualiza resultado
  const resultadoInput = document.getElementById('resultado');
  if (resultadoInput) {
    resultadoInput.value = state.outputs.resultadoText;
  }
}

// Mapeamento de ações para event delegation
const boundActions = {
  calcular: () => { calcular(); updateDOM(); },
  copyResult
};

export const actions = boundActions;

// Inicializa o DOM
document.addEventListener('DOMContentLoaded', () => {
  // Configura event delegation para todos os elementos com data-action
  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.getAttribute('data-action');
    if (actions[action]) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        actions[action](e);
      });
    }
  });

  // Atualiza inputs ao digitarem ou mudarem
  document.querySelectorAll('input, select').forEach(input => {
    const id = input.id;
    if (id) {
      input.addEventListener('input', () => {
        updateInput(id, input.value);
        updateDOM();
      });
      input.addEventListener('change', () => {
        updateInput(id, input.value);
        updateDOM();
      });
    }
  });

  // Inicializa o DOM
  updateDOM();
});
