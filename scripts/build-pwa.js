#!/usr/bin/env node
/**
 * Build script para PWA
 * Gera arquivos auto-contidos em public/ a partir de src/
 * Cada ferramenta é combinada em um único HTML com CSS/JS inline
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.join(__dirname, '..', 'src', 'tools');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'tools');

// Garante que o diretório de saída existe
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Processa cada ferramenta
const tools = fs.readdirSync(SRC_DIR);

for (const tool of tools) {
  const toolPath = path.join(SRC_DIR, tool);
  const stat = fs.statSync(toolPath);
  
  if (!stat.isDirectory()) continue;

  console.log(`🔨 Processando ferramenta: ${tool}`);

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

  // Remove link para CSS (será injetado inline)
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="style\.css"[^>]*>/g, '');

  // Adiciona CSS inline (se existir)
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
    html = html.replace('</head>', `<<style>${cssContent}</style></head>`);
  }

  // Adiciona JS inline (se existirem)
  let jsContent = '';
  
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

  // Injeta JS antes de fechar o body
  if (jsContent) {
    html = html.replace('</body>', `<script type="module">\n${jsContent}\n</script>\n</body>`);
  }

  // Salva o arquivo final
  const outputPath = path.join(PUBLIC_DIR, `${tool}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`  ✅ Gerado: ${outputPath}`);
}

console.log('\n✅ Build PWA concluído!');
