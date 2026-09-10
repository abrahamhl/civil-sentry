import dns from 'node:dns/promises';
import type { Observation } from '@civic-sentry/schema';

export interface DnsLookupResult {
  a: string[];
  mx: { exchange: string; priority: number }[];
  txt: string[][];
}

export type DnsResolver = (domain: string) => Promise<DnsLookupResult>;

/**
 * Real, lawful public DNS resolution — one A/MX/TXT query pass per call,
 * exactly what a browser or mail server does routinely. No retries, no
 * port access, no crafted requests. See THREAT_MODEL.md T-05 (Denial of
 * Service) for why this shape is a hard constraint, not a rate limiter
 * bolted on afterwards.
 */
export const realDnsResolver: DnsResolver = async (domain) => {
  const [a, mx, txt] = await Promise.allSettled([
    dns.resolve4(domain),
    dns.resolveMx(domain),
    dns.resolveTxt(domain),
  ]);
  return {
    a: a.status === 'fulfilled' ? a.value : [],
    mx: mx.status === 'fulfilled' ? mx.value : [],
    txt: txt.status === 'fulfilled' ? txt.value : [],
  };
};

export interface CollectPassiveDnsArgs {
  runId: string;
  assetId: string;
  domain: string;
  /** Injectable for tests and the synthetic demo — no live network needed. */
  resolver?: DnsResolver;
  now?: () => string;
}

/**
 * Passive DNS/MX/TXT collector, tagged 'passive' (THREAT_MODEL.md T-06).
 * Always emits exactly one Observation per record type queried — even
 * when the result is empty. An empty TXT result is not "no observation",
 * it is evidence that a lookup was performed and returned nothing; that
 * distinction is what lets a later Finding say "no SPF record" with
 * VERIFIED confidence instead of guessing.
 */
export async function collectPassiveDns(args: CollectPassiveDnsArgs): Promise<Observation[]> {
  const resolver = args.resolver ?? realDnsResolver;
  const observedAt = (args.now ?? (() => new Date().toISOString()))();
  const result = await resolver(args.domain);

  const base = {
    runId: args.runId,
    assetId: args.assetId,
    collector: '@civic-sentry/collectors/dns',
    collectorVersion: '0.1.0',
    observedAt,
    mode: 'passive' as const,
    source: 'public-dns-resolver',
  };

  return [
    { id: `obs_${args.runId}_${args.assetId}_a`, type: 'DNS_A', rawValue: result.a, ...base },
    { id: `obs_${args.runId}_${args.assetId}_mx`, type: 'DNS_MX', rawValue: result.mx, ...base },
    { id: `obs_${args.runId}_${args.assetId}_txt`, type: 'DNS_TXT', rawValue: result.txt, ...base },
  ];
}
