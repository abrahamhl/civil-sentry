import type { Finding, Confidence, Evidence } from '@civic-sentry/schema';
import { sha256 } from './hash.js';

export class UngroundedFindingError extends Error {}

export interface ProposedFinding {
  title: string;
  description: string;
  severity: Finding['severity'];
  confidence: Confidence;
  evidenceIds: string[];
  category: string;
}

/**
 * The single enforcement point behind the mission's hardest requirement:
 * "AI analysis that cannot emit VERIFIED findings without evidence."
 * This is the only path any adapter — deterministic rule or model-backed —
 * uses to turn a proposal into a real Finding. It is a runtime/type
 * constraint, not a prompt instruction: the proposal's own confidence
 * claim is treated as untrusted input, exactly like the Evidence content
 * it may quote (see THREAT_MODEL.md, AI-specific threat surface).
 */
export function acceptAiFinding(
  proposal: ProposedFinding,
  runId: string,
  organizationId: string,
  assetId: string,
  availableEvidence: Evidence[]
): Finding {
  const evidenceIndex = new Map(availableEvidence.map((e) => [e.id, e]));

  const unresolved = proposal.evidenceIds.filter((id) => !evidenceIndex.has(id));
  if (unresolved.length > 0) {
    throw new UngroundedFindingError(
      `Adapter referenced evidence ID(s) not present in run ${runId}: ${unresolved.join(', ')}`
    );
  }

  if (proposal.confidence === 'VERIFIED' && proposal.evidenceIds.length === 0) {
    throw new UngroundedFindingError(
      `Adapter attempted to emit a VERIFIED finding ("${proposal.title}") with no supporting evidence. Rejected.`
    );
  }

  return {
    id: `fnd_${sha256(runId + proposal.title + proposal.evidenceIds.join(',')).slice(0, 16)}`,
    runId,
    organizationId,
    assetId,
    title: proposal.title,
    description: proposal.description,
    severity: proposal.severity,
    confidence: proposal.confidence,
    evidenceIds: proposal.evidenceIds,
    category: proposal.category,
    source: 'AI_ANALYST_ADAPTER',
  };
}
