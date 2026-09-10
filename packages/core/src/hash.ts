import { createHash } from 'node:crypto';

/**
 * Deterministic content hash. Strings are hashed as-is; everything else is
 * JSON-serialized first. This is the sole basis for Evidence integrity
 * (see evidence.ts#verifyEvidenceChain) — it proves rawValue was not
 * mutated after capture, nothing more (see CURRENT_TRUTH.md limitations).
 */
export function sha256(value: unknown): string {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  return createHash('sha256').update(serialized).digest('hex');
}
