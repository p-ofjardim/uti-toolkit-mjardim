// Main test runner for all calculation tests
// Run with: node --test test/all-calculations.test.js

// Import all test suites
import aguaLivreTests from '../src/tools/agua-livre/calculations/__tests__/index.test.js';
import ventilacaoTests from '../src/tools/ventilacao/calculations/__tests__/index.test.js';
import rsiTests from '../src/tools/rsi/calculations/__tests__/index.test.js';
import infusaoTests from '../src/tools/infusao/calculations/__tests__/index.test.js';
import evolucaoTests from '../src/tools/evolucao/calculations/__tests__/index.test.js';

// Export all tests so Node.js --test can discover them
// Note: Node.js --test automatically runs all .test.js files, but we need
// to ensure they're all loaded. This file helps with that.

// For Node.js --test, we need to use the test runner API or let it auto-discover
// Since we're using ES modules, we'll rely on auto-discovery of .test.js files
