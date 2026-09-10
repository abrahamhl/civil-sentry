import type { Observation, Evidence, Confidence } from '@civil-sentry/schema';
import { sha256 } from './hash.js';

/**
 * Converts a raw Observation into immutable Evidence. `normalize` is
 * supplied by the caller (usually the collector) so this function stays
 * collector-agnostic; the hash always covers the untouched `rawValue`,
 * never the normalized form, so normalization changes can never mask
 * tampering with the original signal.
 */
export function observationToEvidence(
  observation: Observation,
  normalize: (raw: unknown) => unknown,
  confidence: Confidence = 'VERIFIED'
): Evidence {
  return {
    id: `evd_${sha256(observation.id + observation.observedAt).slice(0, 16)}`,
    observationId: observation.id,
    runId: observation.runId,
    assetId: observation.assetId,
    type: observation.type,
    rawValue: observation.rawValue,
    normalizedValue: normalize(observation.rawValue),
    sha256: sha256(observation.rawValue),
    confidence,
    capturedAt: observation.observedAt,
  };
}

export class EvidenceIntegrityError extends Error {}

/**
 * Recomputes sha256 over each Evidence object's current rawValue and
 * compares it to the hash recorded at capture time. Throws on the first
 * mismatch. This is the mechanism behind THREAT_MODEL.md's Tampering
 * mitigation (T-02) — it is a check, not a lock: nothing in this codebase
 * prevents in-memory mutation of an Evidence object, it only guarantees
 * mutation is detectable.
 */
export function verifyEvidenceChain(evidence: Evidence[]): true {
  for (const e of evidence) {
    if (sha256(e.rawValue) !== e.sha256) {
      throw new EvidenceIntegrityError(
        `Evidence ${e.id} failed integrity check: current rawValue does not match the sha256 recorded at capture`
      );
    }
  }
  return true;
}
