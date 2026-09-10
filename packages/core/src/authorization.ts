import type { AuthorizationGrant, Mode } from '@civic-sentry/schema';

export class AuthorizationError extends Error {}

export interface AuthorizationContext {
  mode: Mode;
  targetAssetValue: string;
  organizationId: string;
  grant?: AuthorizationGrant;
  /** Injectable for tests; defaults to the real clock. */
  now?: Date;
}

function matchesScope(scopePattern: string, value: string): boolean {
  if (scopePattern === value) return true;
  if (scopePattern.startsWith('*.')) {
    const suffix = scopePattern.slice(1); // e.g. '.example.nl'
    return value.endsWith(suffix) && value !== suffix.slice(1);
  }
  return false;
}

/**
 * The single enforcement point behind the mission's authorization gate
 * requirement. STREET_PASSIVE mode never needs a grant — lawful public
 * observation requires no permission. AUTHORIZED_ASSESSMENT mode throws
 * unless a grant exists, belongs to the same organization, has not
 * expired, and covers the exact target. This is called by every
 * activeOnly collector before it does anything; it is not called by
 * passive collectors at all (see THREAT_MODEL.md T-06 for the residual
 * gap this leaves: nothing yet fails CI if a passive collector forgets to
 * stay passive).
 */
export function assertAuthorized(ctx: AuthorizationContext): void {
  if (ctx.mode === 'STREET_PASSIVE') return;

  if (!ctx.grant) {
    throw new AuthorizationError(
      `AUTHORIZED_ASSESSMENT mode requires an AuthorizationGrant; none was provided for target "${ctx.targetAssetValue}"`
    );
  }
  if (ctx.grant.organizationId !== ctx.organizationId) {
    throw new AuthorizationError(
      `Grant ${ctx.grant.id} belongs to organization "${ctx.grant.organizationId}", not "${ctx.organizationId}"`
    );
  }
  const now = ctx.now ?? new Date();
  if (new Date(ctx.grant.expiresAt).getTime() < now.getTime()) {
    throw new AuthorizationError(`Grant ${ctx.grant.id} expired at ${ctx.grant.expiresAt}`);
  }
  const inScope = ctx.grant.scope.some((pattern) => matchesScope(pattern, ctx.targetAssetValue));
  if (!inScope) {
    throw new AuthorizationError(
      `Target "${ctx.targetAssetValue}" is not covered by grant ${ctx.grant.id} scope [${ctx.grant.scope.join(', ')}]`
    );
  }
}
