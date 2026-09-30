#!/usr/bin/env node
/**
 * Build script para Extensão Firefox MV2
 * Gera arquivos para extension/ a partir de src/ com:
 * 1. Scripts externos (para conformidade com CSP)
 * 2. Bundle sem sintaxe de módulo (import/export)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { bundleTool } from './lib/bundle.js';

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
 */`;

// Processa cada ferramenta (isolada: uma falha não interrompe as demais)
const tools = fs.readdirSync(SRC_DIR);
const failures = [];
let succeeded = 0;
for (const tool of tools) {
  const toolPath = path.join(SRC_DIR, tool);
  const stat = fs.statSync(toolPath);

  if (!stat.isDirectory()) continue;
  console.log(`🔨 Processando ferramenta para extensão: ${tool}`);

  try {
  // Caminhos dos arquivos
  const htmlPath = path.join(toolPath, 'index.html');
  const cssPath = path.join(toolPath, 'style.css');
  const uiPath = path.join(toolPath, 'ui.js');

  // Verifica se o HTML existe
  if (!fs.existsSync(htmlPath)) {
    console.warn(`  ⚠️  Arquivo index.html não encontrado para ${tool}`);
    continue;
  }

  // Lê o HTML
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Remove link para CSS (será copiado separadamente)
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="style\.css"[^>]*>/g, '');
  // Adiciona link para CSS externo
  html = html.replace('</head>', `<link rel="stylesheet" href="style.css">\n</head>`);

  // Copia CSS (se existir)
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    fs.writeFileSync(path.join(EXT_DIR, `${tool}.css`), cssContent, 'utf8');
    console.log(`  ✅ CSS gerado: ${tool}.css`);
  }

  // Gera o bundle JS (módulos ES achatados em um único escopo seguro)
  let jsContent = COPYRIGHT_HEADER + '\n\n';
  if (fs.existsSync(uiPath)) {
    jsContent += bundleTool(uiPath);
  }

  // Remove scripts externos referenciados no HTML fonte (ex.: ui.js)
  html = html.replace(/<script[^>]*src="ui\.js"[^>]*>\s*<\/script>/g, '');

  // Adiciona script tag ao HTML
  html = html.replace('</body>', `<script src="${tool}.js"></script>\n</body>`);

  // Salva o JS
  fs.writeFileSync(path.join(EXT_DIR, `${tool}.js`), jsContent, 'utf8');
  console.log(`  ✅ JS gerado: ${tool}.js`);

  // Salva o HTML
  const outputHtmlPath = path.join(EXT_DIR, `${tool}.html`);
  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log(`  ✅ HTML gerado: ${tool}.html`);
  succeeded++;
  } catch (err) {
    failures.push({ tool, message: err.message });
    console.error(`  ❌ ${tool}: ${err.message}`);
  }
}

if (failures.length > 0) {
  console.error(`\n❌ Build da extensão concluído com ${failures.length} falha(s): ${failures.map(f => f.tool).join(', ')}`);
  process.exit(1);
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
