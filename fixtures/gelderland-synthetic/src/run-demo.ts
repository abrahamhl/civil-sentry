/**
 * Reproducible synthetic demonstration (mission requirement #12).
 * No live network call is made — the DNS resolver is a canned,
 * deterministic lookup table for three fictional domains. This proves the
 * pipeline (Observation -> Evidence -> Finding, plus the authorization
 * gate) actually runs end to end; it does not prove anything about real
 * DNS infrastructure. Remediation/retest are NOT demonstrated here — see
 * CURRENT_TRUTH.md, that half of the pipeline is not implemented yet.
 */
import type { AuthorizationGrant, Evidence } from '@civil-sentry/schema';
import { collectPassiveDns, type DnsResolver, type DnsLookupResult } from '@civil-sentry/collectors';
import { observationToEvidence, verifyEvidenceChain, assertAuthorized, AuthorizationError, acceptAiFinding } from '@civil-sentry/core';
import { organizations, assets } from './organizations.js';

const syntheticAnswers: Record<string, DnsLookupResult> = {
  'elzendaal-fictional.nl': {
    a: ['203.0.113.10'],
    mx: [{ exchange: 'mail.elzendaal-fictional.nl', priority: 10 }],
    txt: [['v=spf1 -all']],
  },
  // Deliberately "broken" for the demo: no MX, no SPF at all.
  'elzendaal-energie-fictional.nl': {
    a: ['203.0.113.20'],
    mx: [],
    txt: [],
  },
  'vossenbeek-zorg-fictional.nl': {
    a: ['203.0.113.30'],
    mx: [{ exchange: 'mail.vossenbeek-zorg-fictional.nl', priority: 10 }],
    txt: [['v=spf1 include:trusted-fictional-provider.nl -all'], ['v=DMARC1; p=reject']],
  },
};

const syntheticResolver: DnsResolver = async (domain) =>
  syntheticAnswers[domain] ?? { a: [], mx: [], txt: [] };

async function main(): Promise<void> {
  console.log('=== civil-sentry synthetic demonstration — Elzendaal district, Gelderland (fictional) ===\n');
  const runId = `run_demo_${Date.now()}`;
  const allEvidence: Evidence[] = [];

  for (const org of organizations) {
    const asset = assets.find((a) => a.organizationId === org.id);
    if (!asset) continue;
    console.log(`--- ${org.name} — ${asset.value} ---`);

    const observations = await collectPassiveDns({
      runId,
      assetId: asset.id,
      domain: asset.value,
      resolver: syntheticResolver,
      now: () => new Date().toISOString(),
    });
    const evidence = observations.map((o) => observationToEvidence(o, (raw) => raw));
    verifyEvidenceChain(evidence); // throws if anything was tampered with between capture and here
    allEvidence.push(...evidence);

    const txtEvidence = evidence.find((e) => e.type === 'DNS_TXT')!;
    const hasSpf = JSON.stringify(txtEvidence.rawValue).includes('spf1');

    if (!hasSpf) {
      const finding = acceptAiFinding(
        {
          title: 'No SPF record observed',
          description: `A DNS TXT lookup for ${asset.value} returned no SPF record at capture time (${txtEvidence.capturedAt}). This VERIFIED confidence reflects a positive observation of absence, not a guess.`,
          severity: 'MEDIUM',
          confidence: 'VERIFIED',
          evidenceIds: [txtEvidence.id],
          category: 'EMAIL_TRUST',
        },
        runId,
        org.id,
        asset.id,
        evidence
      );
      console.log(`  [FINDING] ${finding.severity} / ${finding.confidence}: ${finding.title}`);
    } else {
      console.log('  [OK] SPF record present');
    }
  }

  console.log('\n--- Authorization gate demonstration ---');
  try {
    assertAuthorized({
      mode: 'AUTHORIZED_ASSESSMENT',
      targetAssetValue: 'elzendaal-fictional.nl',
      organizationId: 'org_elzendaal_gemeente',
    });
    throw new Error('unreachable: gate should have blocked this');
  } catch (err) {
    if (err instanceof AuthorizationError) {
      console.log(`  [BLOCKED as expected] ${err.message}`);
    } else {
      throw err;
    }
  }

  const grant: AuthorizationGrant = {
    id: 'grant_demo_1',
    organizationId: 'org_elzendaal_gemeente',
    scope: ['elzendaal-fictional.nl', '*.elzendaal-fictional.nl'],
    grantedBy: 'Fictional IT Manager, Gemeente Elzendaal (synthetic engagement — not a real signature)',
    grantedAt: '2026-09-01T00:00:00.000Z',
    expiresAt: '2026-12-01T00:00:00.000Z',
    documentHash: 'sha256-of-a-fictional-authorization-letter-not-a-real-hash',
  };
  assertAuthorized({
    mode: 'AUTHORIZED_ASSESSMENT',
    targetAssetValue: 'elzendaal-fictional.nl',
    organizationId: 'org_elzendaal_gemeente',
    grant,
  });
  console.log('  [ALLOWED] Valid, in-scope, unexpired grant present — active checks could now proceed (none are implemented yet, see CURRENT_TRUTH.md)');

  console.log(`\n=== Run complete: ${allEvidence.length} Evidence objects captured, integrity verified, 0 tampering detected ===`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
