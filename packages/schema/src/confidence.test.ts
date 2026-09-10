import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isConfidence, CONFIDENCE_LEVELS } from './confidence.js';

test('isConfidence accepts all five defined levels', () => {
  for (const level of CONFIDENCE_LEVELS) {
    assert.equal(isConfidence(level), true);
  }
});

test('isConfidence rejects arbitrary strings and non-strings', () => {
  assert.equal(isConfidence('MAYBE'), false);
  assert.equal(isConfidence(42), false);
  assert.equal(isConfidence(undefined), false);
});
