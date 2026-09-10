/**
 * Confidence is the single most load-bearing type in this codebase. See
 * THREAT_MODEL.md ("Repudiation") and GAP_MATRIX.md (#4) for why this
 * exists as a type-enforced distinction rather than a free-text field:
 * an AI Analyst Adapter, a deterministic rule, and a human operator all
 * produce Findings through the same constructor path, and none of them
 * can silently upgrade an inference into a verified fact.
 */
export type Confidence =
  | 'VERIFIED' // directly observed at capture time, with linked Evidence
  | 'SUPPORTED' // consistent with evidence, but not conclusive alone
  | 'INFERRED' // a pattern-based judgment, no direct observation
  | 'UNKNOWN' // not yet assessed
  | 'CONTRADICTED'; // a later observation conflicts with an earlier one

export const CONFIDENCE_LEVELS: readonly Confidence[] = [
  'VERIFIED',
  'SUPPORTED',
  'INFERRED',
  'UNKNOWN',
  'CONTRADICTED',
];

export function isConfidence(value: unknown): value is Confidence {
  return (
    typeof value === 'string' &&
    (CONFIDENCE_LEVELS as readonly string[]).includes(value)
  );
}
