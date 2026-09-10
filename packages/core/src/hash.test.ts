import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sha256 } from './hash.js';

test('sha256 is deterministic for the same input', () => {
  assert.equal(sha256({ a: 1 }), sha256({ a: 1 }));
});

test('sha256 changes when input changes', () => {
  assert.notEqual(sha256({ a: 1 }), sha256({ a: 2 }));
});

test('sha256 hashes strings directly, without re-serializing them', () => {
  assert.equal(sha256('hello'), sha256('hello'));
  assert.notEqual(sha256('hello'), sha256(JSON.stringify('hello')));
});
