#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import os from 'os';

const IDENT = '[A-Za-z_$][A-Za-z0-9_$]*';
const identRe = new RegExp(`^${IDENT}$`);

function resolveSpec(fromFile, spec) {
  const resolved = path.resolve(path.dirname(fromFile), spec);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Módulo não encontrado: "${spec}" (importado por ${fromFile})`);
  }
  return resolved;
}

function parseImportClause(clause) {
  const parsed = { default: null, namespace: null, names: [] };
  let rest = clause.trim();
  if (!rest) return parsed;
  if (!rest.startsWith('{') && !/^\*\s+as\b/.test(rest)) {
    const defRe = new RegExp(`^(${IDENT})\\s*,\\s*`);
    const m = rest.match(defRe);
    if (m) {
      parsed.default = m[1];
      rest = rest.slice(m[0].length).trim();
    } else if (identRe.test(rest)) {
      parsed.default = rest;
      return parsed;
    } else {
      throw new Error(`Cláusula de import não suportada: "${clause.trim()}"`);
    }
  }
  if (!rest) return parsed;
  const nsMatch = rest.match(new RegExp(`^\\*\\s+as\\s+(${IDENT})$`));
  if (nsMatch) {
    parsed.namespace = nsMatch[1];
    return parsed;
  }
  const braceMatch = rest.match(/^\{([^}]*)\}$/);
  if (braceMatch) {
    for (const part of braceMatch[1].split(',')) {
      const spec = part.trim();
      if (!spec) continue;
      const asMatch = spec.match(new RegExp(`^(${IDENT})\\s+as\\s+(${IDENT})$`));
      if (asMatch) {
        parsed.names.push({ imported: asMatch[1], local: asMatch[2] });
      } else if (identRe.test(spec)) {
        parsed.names.push({ imported: spec, local: spec });
      } else {
        throw new Error(`Specifier de import não suportado: "${spec}"`);
      }
    }
    return parsed;
  }
  throw new Error(`Cláusula de import não suportada: "${clause.trim()}"`);
}

function findImports(source, file) {
  const imports = [];
  const ranges = [];
  const re = /(^[ \t]*import\s+)([\s\S]*?)(\bfrom\s*)(['"])([^'"\n]+)(['"])([ \t]*;?[ \t]*$)/gm;
  let m;
  while ((m = re.exec(source))) {
    imports.push({
      clause: m[2],
      sourcePath: m[5],
      resolved: resolveSpec(file, m[5]),
      parsed: parseImportClause(m[2]),
    });
    ranges.push({ start: m.index, end: m.index + m[0].length });
  }
  const sideEffectRe = /(^[ \t]*import\s*)(['"])([^'"\n]+)(['"])([ \t]*;?[ \t]*$)/gm;
  while ((m = sideEffectRe.exec(source))) {
    if (imports.some((imp) => imp.sourcePath === m[3])) continue;
    imports.push({ clause: '', sourcePath: m[3], resolved: resolveSpec(file, m[3]), parsed: parseImportClause('') });
    ranges.push({ start: m.index, end: m.index + m[0].length });
  }
  return { imports, ranges };
}

function findExports(source) {
  const exports = new Map();
  const ranges = [];
  const declRe = new RegExp(`\\bexport\\s+default\\s+(?:(?:async\\s+)?function\\s*\\*?\\s*(${IDENT})|(?:const|let|var|class)\\s+(${IDENT}))`, 'g');
  let m;
  while ((m = declRe.exec(source))) {
    exports.set('default', { kind: 'local', local: m[1] || m[2] });
  }
  const namedDeclRe = new RegExp(`\\bexport\\s+((?:async\\s+)?function\\s*\\*?\\s*|const\\s+|let\\s+|var\\s+|class\\s+)(${IDENT})`, 'g');
  while ((m = namedDeclRe.exec(source))) {
    if (!exports.has(m[2])) exports.set(m[2], { kind: 'local', local: m[2] });
  }
  const blockRe = /\bexport\s*\{([^}]*)\}\s*(?:from\s*(['"])([^'"\n]+)\2\s*)?;?/g;
  while ((m = blockRe.exec(source))) {
    ranges.push({ start: m.index, end: m.index + m[0].length });
    const fromPath = m[3] || null;
    const clauseText = m[1].replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const part of clauseText.split(',')) {
      const spec = part.trim();
      if (!spec) continue;
      const asMatch = spec.match(new RegExp(`^(${IDENT})\\s+as\\s+(${IDENT})$`));
      const imported = asMatch ? asMatch[1] : spec;
      const exported = asMatch ? asMatch[2] : spec;
      if (!identRe.test(imported)) {
        throw new Error(`Specifier de export não suportado: "${spec}"`);
      }
      if (fromPath) {
        exports.set(exported, { kind: 'reexport', imported, sourcePath: fromPath });
      } else {
        exports.set(exported, { kind: 'local', local: imported });
      }
    }
  }
  return { exports, ranges };
}

function buildBody(source, importRanges, exportRanges, file) {
  const ranges = [...importRanges, ...exportRanges].sort((a, b) => b.start - a.start);
  let out = source;
  for (const r of ranges) {
    out = out.slice(0, r.start) + out.slice(r.end);
  }
  out = out.replace(/\bexport\s+default\s+(?=(?:async\s+)?function\b|class\b)/g, '');
  out = out.replace(/\bexport\s+default\s+/g, 'var __default__ = ');
  out = out.replace(/\bexport\s+(?=(?:async\s+)?function\b|class\b|(?:const|let|var)\b)/g, '');
  if (/\bimport\b|\bexport\b/.test(out.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, ''))) {
    const leftover = out.split('\n').filter((line) => /\bimport\b|\bexport\b/.test(line));
    throw new Error(`Sintaxe de módulo não tratada em ${file}:\n${leftover.join('\n')}`);
  }
  return out;
}

function loadModule(file) {
  const source = fs.readFileSync(file, 'utf8');
  const { imports, ranges: importRanges } = findImports(source, file);
  const { exports, ranges: exportRanges } = findExports(source);
  const body = buildBody(source, importRanges, exportRanges, file);
  const mod = { file, imports, exports, body, deps: [] };
  const specs = new Set();
  for (const imp of imports) specs.add(imp.sourcePath);
  for (const exp of exports.values()) {
    if (exp.kind === 'reexport') specs.add(exp.sourcePath);
  }
  mod.depFiles = [...specs].map((spec) => resolveSpec(file, spec));
  return mod;
}

function buildGraph(entryFile) {
  const modules = new Map();
  function visit(file, stack) {
    const norm = path.resolve(file);
    if (modules.has(norm)) return modules.get(norm);
    if (stack.has(norm)) {
      throw new Error(`Ciclo de imports detectado: ${[...stack, norm].join(' -> ')}`);
    }
    stack.add(norm);
    const mod = loadModule(norm);
    mod.deps = mod.depFiles.map((dep) => visit(dep, stack));
    stack.delete(norm);
    modules.set(norm, mod);
    return mod;
  }
  return { entry: visit(entryFile, new Set()), modules };
}

function orderModules(entry) {
  const order = [];
  const seen = new Set();
  (function walk(mod) {
    if (seen.has(mod.file)) return;
    seen.add(mod.file);
    for (const dep of mod.deps) walk(dep);
    order.push(mod);
  })(entry);
  return order;
}

function refName(mod, index) {
  const base = path.basename(mod.file, '.js').replace(/[^A-Za-z0-9_$]/g, '_');
  return `__mod_${base}_${index}`;
}

function wrapModule(mod, refOf, index) {
  const params = [];
  const args = [];
  const takenParams = new Set();
  function addParam(name, argExpr) {
    let param = name;
    let i = 2;
    while (takenParams.has(param)) param = `${name}_${i++}`;
    takenParams.add(param);
    params.push(param);
    args.push(argExpr);
    return param;
  }
  for (const imp of mod.imports) {
    const depRef = refOf.get(imp.resolved);
    const parsed = imp.parsed;
    if (parsed.default) addParam(parsed.default, `${depRef}.default`);
    if (parsed.namespace) addParam(parsed.namespace, depRef);
    for (const n of parsed.names) addParam(n.local, `${depRef}.${n.imported}`);
  }
  const returnPairs = [];
  for (const [exported, exp] of mod.exports) {
    if (exp.kind === 'local') {
      returnPairs.push(`${exported}: ${exp.local}`);
    } else {
      const depFile = resolveSpec(mod.file, exp.sourcePath);
      const depRef = refOf.get(depFile);
      const param = addParam(`__reexport_${exported}`, `${depRef}.${exp.imported}`);
      returnPairs.push(`${exported}: ${param}`);
    }
  }
  const ref = refName(mod, index);
  const body = mod.body.trim();
  const head = params.length ? `var ${ref} = (function (${params.join(', ')}) {` : `var ${ref} = (function () {`;
  const tail = params.length ? `})(${args.join(', ')});` : `})();`;
  const returnStmt = returnPairs.length ? `return { ${returnPairs.join(', ')} };` : '';
  return `${head}\n${body}\n${returnStmt}\n${tail}`;
}

function bundleTool(entryFile) {
  const { entry } = buildGraph(entryFile);
  const order = orderModules(entry);
  const refOf = new Map();
  order.forEach((mod, i) => refOf.set(mod.file, refName(mod, i)));
  const chunks = order.map((mod, i) => wrapModule(mod, refOf, i));
  const js = chunks.join('\n\n');
  if (js.includes('</script')) {
    throw new Error(`Bundle contém "</script" e não pode ser embutido inline: ${entryFile}`);
  }
  return js;
}

function assertSyntax(js, label) {
  const tmp = path.join(os.tmpdir(), `uti-toolkit-check-${process.pid}.js`);
  try {
    fs.writeFileSync(tmp, js, 'utf8');
    execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' });
  } catch (err) {
    const detail = err.stderr ? err.stderr.toString().split('\n')[0] : err.message;
    throw new Error(`Sintaxe inválida no bundle gerado (${label}): ${detail}`);
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
}

export { bundleTool, assertSyntax };
