import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectPassiveDns } from './dns.js';
import type { DnsResolver } from './dns.js';

const fakeResolver: DnsResolver = async () => ({
  a: ['203.0.113.10'],
  mx: [{ exchange: 'mail.elzendaal-fictional.nl', priority: 10 }],
  txt: [['v=spf1 -all']],
});

test('collectPassiveDns emits exactly one Observation per record type, all tagged passive', async () => {
  const observations = await collectPassiveDns({
    runId: 'run_1',
    assetId: 'asset_1',
    domain: 'elzendaal-fictional.nl',
    resolver: fakeResolver,
    now: () => '2026-09-10T00:00:00.000Z',
  });
  assert.equal(observations.length, 3);
  assert.ok(observations.every((o) => o.mode === 'passive'));
  assert.ok(observations.some((o) => o.type === 'DNS_A'));
  assert.ok(observations.some((o) => o.type === 'DNS_MX'));
  assert.ok(observations.some((o) => o.type === 'DNS_TXT'));
});

test('collectPassiveDns still emits an Observation (with empty rawValue) when a resolver finds nothing — absence is evidence too', async () => {
  const emptyResolver: DnsResolver = async () => ({ a: [], mx: [], txt: [] });
  const observations = await collectPassiveDns({
    runId: 'run_1',
    assetId: 'asset_2',
    domain: 'nothing-fictional.example',
    resolver: emptyResolver,
  });
  assert.equal(observations.length, 3);
  const txt = observations.find((o) => o.type === 'DNS_TXT')!;
  assert.deepEqual(txt.rawValue, []);
});
