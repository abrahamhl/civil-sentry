import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Observation } from '@civil-sentry/schema';
import { observationToEvidence, verifyEvidenceChain, EvidenceIntegrityError } from './evidence.js';

const observation: Observation = {
  id: 'obs_1',
  runId: 'run_1',
  assetId: 'asset_1',
  type: 'DNS_TXT',
  source: 'public-dns-resolver',
  collector: '@civil-sentry/collectors/dns',
  collectorVersion: '0.1.0',
  observedAt: '2026-09-10T00:00:00.000Z',
  rawValue: [['v=spf1 -all']],
  mode: 'passive',
};

test('observationToEvidence hashes the raw value at capture', () => {
  const evidence = observationToEvidence(observation, (raw) => raw);
  assert.equal(typeof evidence.sha256, 'string');
  assert.equal(evidence.sha256.length, 64);
  assert.equal(evidence.confidence, 'VERIFIED');
});

test('verifyEvidenceChain passes for untampered evidence', () => {
  const evidence = observationToEvidence(observation, (raw) => raw);
  assert.equal(verifyEvidenceChain([evidence]), true);
});

test('verifyEvidenceChain detects tampering with rawValue after capture', () => {
  const evidence = observationToEvidence(observation, (raw) => raw);
  const tampered = { ...evidence, rawValue: [['v=spf1 include:evil.example ~all']] };
  assert.throws(() => verifyEvidenceChain([tampered]), EvidenceIntegrityError);
});
