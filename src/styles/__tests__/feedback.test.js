import { test } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';
import { truncateBody, buildFeedbackBody } from '../feedback.js';

test('short body is not truncated', () => {
  strictEqual(truncateBody('texto curto'), 'texto curto');
});

test('long body is truncated with marker', () => {
  const result = truncateBody('a'.repeat(3000));
  ok(result.length < 3000);
  ok(result.endsWith('…texto truncado por limite de tamanho)'));
});
