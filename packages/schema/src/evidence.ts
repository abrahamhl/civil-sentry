import type { Confidence } from './confidence.js';

export type ObservationType = 'DNS_A' | 'DNS_MX' | 'DNS_TXT' | 'DNS_NS' | 'HTTP_HEADER' | 'TLS_CERT';

/**
 * A raw, as-captured signal. Not yet evidence — becoming Evidence is what
 * attaches a hash and a confidence to it. See @civil-sentry/core/evidence.
 */
export interface Observation {
  id: string;
  runId: string;
  assetId: string;
  type: ObservationType;
  source: string;
  collector: string;
  collectorVersion: string;
  observedAt: string;
  rawValue: unknown;
  /**
   * The collector's own declared mode. A `passive` collector performing
   * anything beyond a single lawful public lookup would contradict its own
   * tag — see THREAT_MODEL.md T-06 for why this field exists.
   */
  mode: 'passive' | 'activeOnly';
}

export interface Evidence {
  id: string;
  observationId: string;
  runId: string;
  assetId: string;
  type: ObservationType;
  rawValue: unknown;
  normalizedValue: unknown;
  /** sha256 of rawValue at capture time — see core/evidence.ts#verifyEvidenceChain. */
  sha256: string;
  confidence: Confidence;
  capturedAt: string;
  metadata?: { redacted?: boolean; [key: string]: unknown };
}

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Finding {
  id: string;
  runId: string;
  organizationId: string;
  assetId: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: Confidence;
  /** Must be non-empty if confidence === 'VERIFIED' — enforced in core/ai-adapter.ts. */
  evidenceIds: string[];
  /** Free-text category, e.g. mapped to a NIST CSF 2.0 category for readability. Informational only — not a compliance claim. */
  category: string;
  source: 'DETERMINISTIC_RULE' | 'AI_ANALYST_ADAPTER';
}
