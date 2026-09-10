import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Observation } from '@civic-sentry/schema';
import { observationToEvidence } from './evidence.js';
import { acceptAiFinding, UngroundedFindingError } from './ai-adapter.js';

const observation: Observation = {
  id: 'obs_1',
  runId: 'run_1',
  assetId: 'asset_1',
  type: 'DNS_TXT',
  source: 'public-dns-resolver',
  collector: '@civic-sentry/collectors/dns',
  collectorVersion: '0.1.0',
  observedAt: '2026-09-10T00:00:00.000Z',
  rawValue: [['v=spf1 -all']],
  mode: 'passive',
};
const evidence = observationToEvidence(observation, (raw) => raw);

test('rejects a VERIFIED finding with zero evidence IDs', () => {
  assert.throws(
    () =>
      acceptAiFinding(
        { title: 'x', description: 'y', severity: 'LOW', confidence: 'VERIFIED', evidenceIds: [], category: 'test' },
        'run_1',
        'org_1',
        'asset_1',
        [evidence]
      ),
    UngroundedFindingError
  );
});

test('rejects a finding referencing an evidence ID absent from the run', () => {
  assert.throws(
    () =>
      acceptAiFinding(
        {
          title: 'x',
          description: 'y',
          severity: 'LOW',
          confidence: 'SUPPORTED',
          evidenceIds: ['evd_does_not_exist'],
          category: 'test',
        },
        'run_1',
        'org_1',
        'asset_1',
        [evidence]
      ),
    UngroundedFindingError
  );
});

test('accepts a VERIFIED finding with a real, resolvable evidence ID', () => {
  const finding = acceptAiFinding(
    {
      title: 'Permissive SPF record',
      description: 'TXT record present but does not hard-fail (-all).',
      severity: 'LOW',
      confidence: 'VERIFIED',
      evidenceIds: [evidence.id],
      category: 'EMAIL_TRUST',
    },
    'run_1',
    'org_1',
    'asset_1',
    [evidence]
  );
  assert.equal(finding.confidence, 'VERIFIED');
  assert.deepEqual(finding.evidenceIds, [evidence.id]);
  assert.equal(finding.source, 'AI_ANALYST_ADAPTER');
});

test('accepts an INFERRED finding even with no evidence — the bar only bites at VERIFIED', () => {
  const finding = acceptAiFinding(
    {
      title: 'Possible misconfiguration pattern',
      description: 'Unconfirmed, pattern-based judgment.',
      severity: 'INFO',
      confidence: 'INFERRED',
      evidenceIds: [],
      category: 'test',
    },
    'run_1',
    'org_1',
    'asset_1',
    [evidence]
  );
  assert.equal(finding.confidence, 'INFERRED');
});
