#!/usr/bin/env node
/**
 * Build script para Extensão Firefox MV2
 * Gera arquivos para extension/ a partir de src/ com:
 * 1. Scripts externos (para conformidade com CSP)
 * 2. Conversão de onclick para data-fn/data-arg
 * 3. Event delegation para Firefox MV2
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.join(__dirname, '..', 'src', 'tools');
const EXT_DIR = path.join(__dirname, '..', 'extension', 'tools');

// Garante que o diretório de saída existe
if (!fs.existsSync(EXT_DIR)) {
  fs.mkdirSync(EXT_DIR, { recursive: true });
}

// Copyright header para arquivos JS
const COPYRIGHT_HEADER = `/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
`;

// Event delegation snippet para Firefox MV2
const DELEGATION_SNIPPET = `
// Firefox MV2 event delegation (replaces inline onclick)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-fn]').forEach(function (el) {
    var fn = el.getAttribute('data-fn');
    var arg = el.getAttribute('data-arg');
    el.addEventListener('click', function (e) {
      if (typeof window[fn] === 'function') {
        arg !== null ? window[fn](e, arg) : window[fn]();
      }
    });
  });

  // Adicional: suporte para data-action (usado em ui.js)
  document.querySelectorAll('[data-action]').forEach(function (el) {
    var action = el.getAttribute('data-action');
    el.addEventListener('click', function (e) {
      if (typeof window[action] === 'function') {
        window[action](e);
      }
    });
  });
});
`;

// Função para converter onclick em data-fn/data-arg
function convertOnclick(html) {
  return html.replace(/\s+onclick="([^"]+)"/g, function (_, expr) {
    expr = expr.trim();

    // Match: name(event, 'arg')
    let m = expr.match(/^(\w+)\s*\(\s*event\s*,\s*['"]([^'"]+)['"]\s*\)$/);
    if (m) return ` data-fn="${m[1]}" data-arg="${m[2]}"`;

    // Match: name('arg')
    m = expr.match(/^(\w+)\s*\(\s*['"]([^'"]+)['"]\s*\)$/);
    if (m) return ` data-fn="${m[1]}" data-arg="${m[2]}"`;

    // Match: name()
    m = expr.match(/^(\w+)\s*\(\s*\)$/);
    if (m) return ` data-fn="${m[1]}"`;

    // Fallback: mantém onclick (será tratado pelo event delegation)
    return ` onclick="${expr}"`;
  });
}

// Processa cada ferramenta
const tools = fs.readdirSync(SRC_DIR);

for (const tool of tools) {
  const toolPath = path.join(SRC_DIR, tool);
  const stat = fs.statSync(toolPath);
  
  if (!stat.isDirectory()) continue;

  console.log(`🔨 Processando ferramenta para extensão: ${tool}`);

  // Caminhos dos arquivos
  const htmlPath = path.join(toolPath, 'index.html');
  const cssPath = path.join(toolPath, 'style.css');
  const calculationsIndexPath = path.join(toolPath, 'calculations', 'index.js');
  const statePath = path.join(toolPath, 'state.js');
  const uiPath = path.join(toolPath, 'ui.js');

  // Verifica se o HTML existe
  if (!fs.existsSync(htmlPath)) {
    console.warn(`  ⚠️  Arquivo index.html não encontrado para ${tool}`);
    continue;
  }

  // Lê o HTML
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Converte onclick para data-fn (CSP Firefox)
  html = convertOnclick(html);

  // Remove link para CSS (será copiado separadamente)
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="style\.css"[^>]*>/g, '');

  // Adiciona link para CSS externo
  html = html.replace('</head>', '<link rel="stylesheet" href="style.css">\n</head>');

  // Copia CSS (se existir)
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    fs.writeFileSync(path.join(EXT_DIR, `${tool}.css`), cssContent, 'utf8');
    console.log(`  ✅ CSS gerado: ${tool}.css`);
  }

  // Combina todos os JS em um único arquivo
  let jsContent = COPYRIGHT_HEADER + '\n\n';
  
  // Adiciona cálculos (se existir)
  if (fs.existsSync(calculationsIndexPath)) {
    jsContent += fs.readFileSync(calculationsIndexPath, 'utf8') + '\n\n';
  }
  
  // Adiciona state (se existir)
  if (fs.existsSync(statePath)) {
    jsContent += fs.readFileSync(statePath, 'utf8') + '\n\n';
  }
  
  // Adiciona UI (se existir)
  if (fs.existsSync(uiPath)) {
    jsContent += fs.readFileSync(uiPath, 'utf8') + '\n\n';
  }

  // Adiciona event delegation snippet
  jsContent += DELEGATION_SNIPPET;

  // Adiciona script tag ao HTML
  html = html.replace('</body>', `<script src="${tool}.js"></script>\n</body>`);

  // Salva o JS
  fs.writeFileSync(path.join(EXT_DIR, `${tool}.js`), jsContent, 'utf8');
  console.log(`  ✅ JS gerado: ${tool}.js`);

  // Salva o HTML
  const outputHtmlPath = path.join(EXT_DIR, `${tool}.html`);
  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`  ✅ HTML gerado: ${tool}.html`);
}

// Copia o index.html e app.js da extensão (se existirem)
const extensionIndexPath = path.join(__dirname, '..', 'extension', 'index.html');
const extensionAppPath = path.join(__dirname, '..', 'extension', 'app.js');
const extensionBackgroundPath = path.join(__dirname, '..', 'extension', 'background.js');
const extensionManifestPath = path.join(__dirname, '..', 'extension', 'manifest.json');

// Se não existirem, copia os originais
const originalExtensionIndexPath = path.join(__dirname, '..', 'extension', 'index.html');
if (!fs.existsSync(originalExtensionIndexPath)) {
  console.warn('⚠️  extension/index.html não encontrado. Copie o arquivo original.');
} else {
  console.log('\n📄 Copiando arquivos da extensão...');
}

// Gera o .xpi
console.log('\n📦 Gerando uti-toolkit-firefox.xpi...');
try {
  execSync('rm -f uti-toolkit-firefox.xpi && cd extension && zip -r ../uti-toolkit-firefox.xpi .', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..') 
  });
  const size = fs.statSync(path.join(__dirname, '..', 'uti-toolkit-firefox.xpi')).size;
  console.log(`✅ uti-toolkit-firefox.xpi gerado (${(size / 1024).toFixed(1)} KB)`);
} catch (e) {
  console.error('❌ Erro ao gerar .xpi:', e.message);
}

console.log('\n✅ Build Extensão Firefox concluído!');
