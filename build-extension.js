#!/usr/bin/env node
/**
 * Transforms extension/tools/*.html for Firefox MV2 compliance:
 *  1. Extracts <script> blocks → external .js files
 *  2. Replaces onclick="..." with data-fn / data-arg attributes
 *  3. Injects event-delegation loader at the end of each JS file
 *  4. Rewrites the HTML to reference the external JS
 */

const fs   = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, 'extension', 'tools');
const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.html'));

// Event delegation snippet injected at the end of every extracted JS file.
const DELEGATION_SNIPPET = `
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
`;

/**
 * Convert: onclick="funcName(event, 'tabId')"  →  data-fn="funcName" data-arg="tabId"
 *          onclick="funcName('resultId')"        →  data-fn="funcName" data-arg="resultId"
 *          onclick="funcName()"                  →  data-fn="funcName"
 */
function convertOnclick(html) {
  return html.replace(/\s+onclick="([^"]+)"/g, function (_, expr) {
    expr = expr.trim();

    // Match: name(event, 'arg') or name(event, "arg")
    let m = expr.match(/^(\w+)\s*\(\s*event\s*,\s*['"]([^'"]+)['"]\s*\)$/);
    if (m) return ` data-fn="${m[1]}" data-arg="${m[2]}"`;

    // Match: name('arg') or name("arg")
    m = expr.match(/^(\w+)\s*\(\s*['"]([^'"]+)['"]\s*\)$/);
    if (m) return ` data-fn="${m[1]}" data-arg="${m[2]}"`;

    // Match: name()
    m = expr.match(/^(\w+)\s*\(\s*\)$/);
    if (m) return ` data-fn="${m[1]}"`;

    // Fallback: unknown pattern — keep as data-fn-raw for manual review
    console.warn(`  [WARN] unhandled onclick: ${expr}`);
    return ` data-fn-raw="${expr.replace(/"/g, '&quot;')}"`;
  });
}

files.forEach(function (file) {
  const htmlPath = path.join(TOOLS_DIR, file);
  const jsName   = file.replace('.html', '.js');
  const jsPath   = path.join(TOOLS_DIR, jsName);

  let html = fs.readFileSync(htmlPath, 'utf8');

  // ── 1. Extract all <script> blocks ──────────────────────────────────────
  const scriptBlocks = [];
  const scriptRe = /<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi;

  // Collect script blocks that have no src (inline scripts only)
  html = html.replace(/<script(\s[^>]*)?>[\s\S]*?<\/script>/gi, function (match, attrs) {
    if (attrs && /\bsrc\s*=/.test(attrs)) return match; // keep external <script src>
    const content = match.replace(/<script(?:\s[^>]*)?>/i, '').replace(/<\/script>/i, '');
    scriptBlocks.push(content.trim());
    return ''; // remove from HTML
  });

  // ── 2. Replace onclick attributes ───────────────────────────────────────
  html = convertOnclick(html);

  // ── 3. Write external JS file ────────────────────────────────────────────
  const jsContent = scriptBlocks.join('\n\n') + DELEGATION_SNIPPET;
  fs.writeFileSync(jsPath, jsContent, 'utf8');

  // ── 4. Inject <script src="jsName"> before </body> ──────────────────────
  html = html.replace(/<\/body>/i, `  <script src="${jsName}"></script>\n</body>`);

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`✓ ${file}  →  ${jsName}  (${scriptBlocks.length} script block(s) extracted)`);
});

// ── Also fix index.html nav script ──────────────────────────────────────────
const indexPath = path.join(__dirname, 'extension', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const indexScripts = [];
indexHtml = indexHtml.replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, function (match, attrs) {
  if (attrs && /\bsrc\s*=/.test(attrs)) return match;
  const content = match.replace(/<script(?:\s[^>]*)?>/i, '').replace(/<\/script>/i, '');
  indexScripts.push(content.trim());
  return '';
});

const indexJsPath = path.join(__dirname, 'extension', 'app.js');
fs.writeFileSync(indexJsPath, indexScripts.join('\n\n'), 'utf8');
indexHtml = indexHtml.replace(/<\/body>/i, '  <script src="app.js"></script>\n</body>');
fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log(`✓ index.html  →  app.js`);

// ── Rebuild .xpi ─────────────────────────────────────────────────────────────
const { execSync } = require('child_process');
try {
  execSync('rm -f uti-toolkit-firefox.xpi && cd extension && zip -r ../uti-toolkit-firefox.xpi .', { stdio: 'inherit' });
  const size = fs.statSync(path.join(__dirname, 'uti-toolkit-firefox.xpi')).size;
  console.log(`\n📦 uti-toolkit-firefox.xpi  (${(size/1024).toFixed(1)} KB)`);
} catch (e) {
  console.error('zip failed:', e.message);
}
