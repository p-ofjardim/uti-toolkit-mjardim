#!/usr/bin/env node
/**
 * Build script para PWA
 * Gera arquivos auto-contidos em public/ a partir de src/
 * Cada ferramenta é combinada em um único HTML com CSS/JS inline
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bundleTool, assertSyntax } from './lib/bundle.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '..', 'src', 'tools');
const SHELL_DIR = path.join(__dirname, '..', 'src', 'shell');
const PUBLIC_ROOT = path.join(__dirname, '..', 'public');
const DOCS_ROOT = path.join(__dirname, '..', 'docs');
const PUBLIC_DIR = path.join(PUBLIC_ROOT, 'tools');
const DOCS_DIR = path.join(DOCS_ROOT, 'tools');
const BASE_PATH = '/uti-toolkit-mjardim/';

// Versionamento único do cache do service worker (incrementar a cada deploy com HTML novo)
const SW_VERSION = 7;
const CACHE_LOCAL = `uti-toolkit-v${SW_VERSION}`;
const CACHE_DOCS = `uti-toolkit-gh-pages-v${SW_VERSION}`;

/**
 * Substitui os placeholders ({{BASE}}, {{CACHE_NAME}}) do template de shell.
 * No modo PWA, o conteúdo dos blocos {{PWA_ONLY}}...{{END_PWA_ONLY}} é mantido
 * (e os marcadores, removidos). No modo extensão, os blocos são removidos.
 */
function renderTemplate(content, base, cacheName, mode = 'pwa') {
  let out = content
    .replaceAll('{{BASE}}', base)
    .replaceAll('{{CACHE_NAME}}', cacheName);
  const blockRe = /\{\{PWA_ONLY\}\}([\s\S]*?)\{\{END_PWA_ONLY\}\}/g;
  if (mode === 'pwa') {
    out = out.replace(blockRe, '$1');
    out = out.replaceAll('/* PWA-ONLY */\n', '').replaceAll('\n/* END PWA-ONLY */', '');
  } else {
    out = out.replace(blockRe, '');
    out = out.replaceAll('/* PWA-ONLY */\n', '').replaceAll('\n/* END PWA-ONLY */', '');
    out = out.replace(/^\s*\n/gm, '');
  }
  out = out.replaceAll('{{PWA_ONLY}}', '').replaceAll('{{END_PWA_ONLY}}', '');
  return out;
}

// Garante que os diretórios de saída existem
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

/**
 * Reescreve caminhos absolutos ("/tools/x.html") para a base do GitHub Pages.
 */
function rewriteBase(html, base) {
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${base}`);
}

// Processa cada ferramenta (isolada: uma falha não interrompe as demais)
const tools = fs.readdirSync(SRC_DIR);
const failures = [];
let succeeded = 0;
for (const tool of tools) {
  const toolPath = path.join(SRC_DIR, tool);
  const stat = fs.statSync(toolPath);

  if (!stat.isDirectory()) continue;
  console.log(`🔨 Processando ferramenta: ${tool}`);

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

  // Remove link para CSS (será injetado inline)
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="style\.css"[^>]*>/g, '');

  // Adiciona CSS inline (se existir)
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
    html = html.replace('</head>', `<style>${cssContent}</style></head>`);
  }

  // Gera o bundle JS (módulos ES achatados em um único escopo seguro)
  let jsContent = '';
  if (fs.existsSync(uiPath)) {
    jsContent = bundleTool(uiPath);
    assertSyntax(jsContent, tool);
  }

  // Remove scripts externos referenciados no HTML fonte (ex.: ui.js)
  html = html.replace(/<script[^>]*src="ui\.js"[^>]*>\s*<\/script>/g, '');

  // Injeta JS antes de fechar o body
  if (jsContent) {
    html = html.replace('</body>', `<script>\n${jsContent}\n</script>\n</body>`);
  }

  // Salva o arquivo final
  const outputPath = path.join(PUBLIC_DIR, `${tool}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`  ✅ Gerado: ${outputPath}`);

  // Versão para GitHub Pages (docs/), com caminhos reescritos para a base
  const docsHtml = rewriteBase(html, BASE_PATH);
  fs.writeFileSync(path.join(DOCS_DIR, `${tool}.html`), docsHtml, 'utf8');
  console.log(`  ✅ Gerado: ${DOCS_DIR}${path.sep}${tool}.html`);
  succeeded++;
  } catch (err) {
    failures.push({ tool, message: err.message });
    console.error(`  ❌ ${tool}: ${err.message}`);
  }
}

// ── Shell (index.html, manifest.json, sw.js) a partir de src/shell/ ──
const shellAppJs = fs.readFileSync(path.join(SHELL_DIR, 'app.js'), 'utf8');
const shellFiles = ['index.html', 'manifest.json', 'sw.js'];
for (const file of shellFiles) {
  const template = fs.readFileSync(path.join(SHELL_DIR, file), 'utf8');
  const rendered = renderTemplate(template, '/', CACHE_LOCAL);
  const finalContent = rendered.replace(
    '  {{SHELL_SCRIPT}}',
    `<script>\n${renderTemplate(shellAppJs, '/', CACHE_LOCAL)}\n  </script>`
  );
  fs.writeFileSync(path.join(PUBLIC_ROOT, file), finalContent, 'utf8');
  const docsContent = renderTemplate(template, BASE_PATH, CACHE_DOCS)
    .replace(
      '  {{SHELL_SCRIPT}}',
      `<script>\n${renderTemplate(shellAppJs, BASE_PATH, CACHE_DOCS)}\n  </script>`
    );
  fs.writeFileSync(path.join(DOCS_ROOT, file), docsContent, 'utf8');
  console.log(`✅ Shell gerado: ${file} (public/ e docs/)`);
}

if (failures.length > 0) {
  console.error(`\n❌ Build PWA concluído com ${failures.length} falha(s): ${failures.map(f => f.tool).join(', ')}`);
  process.exit(1);
}

console.log(`\n✅ Build PWA concluído! ${succeeded} ferramenta(s) processada(s).`);
