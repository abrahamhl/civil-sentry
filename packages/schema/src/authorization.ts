import type { Mode } from './organization.js';

/**
 * A typed, timestamped, scope-bound record. This is NOT a legal
 * instrument and does not replace a signed engagement letter — it is the
 * software's internal representation of one, entered by the operator, so
 * the authorization gate in @civic-sentry/core has something concrete to
 * check against instead of trusting operator intent implicitly.
 * See THREAT_MODEL.md T-01 for the residual-risk discussion.
 */
export interface AuthorizationGrant {
  id: string;
  organizationId: string;
  /** Asset value patterns this grant covers, e.g. ["*.example.nl", "example.nl"]. */
  scope: string[];
  /** Name/role of whoever signed the underlying authorization document. */
  grantedBy: string;
  grantedAt: string;
  expiresAt: string;
  /** sha256 of the authorization document's text, entered by the operator. */
  documentHash: string;
}

export interface Run {
  id: string;
  organizationId: string;
  mode: Mode;
  tool: string;
  toolVersion: string;
  startedAt: string;
  status: 'STARTED' | 'COMPLETED' | 'FAILED';
  /** Required by the authorization gate whenever mode is AUTHORIZED_ASSESSMENT. */
  authorizationGrantId?: string;
}
