# ADR-001: Authorization as a runtime/type gate, not a policy document

**Status:** Accepted
**Date:** 2026-09-10

## Context

The mission requires two strict modes (`STREET_PASSIVE`,
`AUTHORIZED_ASSESSMENT`) and an authorization gate that prevents active
assessment without valid scope. The obvious, cheaper alternative is a
policy document + operator discipline: "don't run active checks unless
you have written authorization." `THREAT_MODEL.md` (T-01, T-06) explains
why that alternative was rejected.

## Decision

`assertAuthorized()` in `packages/core/src/authorization.ts` is the single
enforcement point. Every collector tagged `activeOnly` in its
`Observation.mode` field must call it, and it throws
`AuthorizationError` unless a matching `AuthorizationGrant` exists:
same organization, unexpired, scope pattern matches the exact target.
`STREET_PASSIVE` mode is a no-op for this function — passive collection
requires no permission, by design.

## Consequences

- **Positive:** an operator (or a future contributor) cannot accidentally
  run an active check by forgetting a policy step — the code itself
  refuses. Tested explicitly for missing grant, expired grant, wrong
  organization, and out-of-scope target (`authorization.test.ts`).
- **Negative / residual risk:** this gates the *software*, not the
  *operator's honesty*. Nothing stops someone from typing a scope pattern
  that doesn't match their real authorization document. Making that
  cryptographically unforgeable (e.g., requiring a counter-signed
  document hash from a third party) is out of scope for this PR — tracked
  as a future ADR if a real engagement ever needs it.
- **Not yet enforced:** no `activeOnly` collector exists yet in this
  codebase for the gate to protect (see `CURRENT_TRUTH.md`). Building the
  gate before the thing it gates is deliberate sequencing, not an
  oversight — see `GAP_MATRIX.md` for why implementing an active
  collector without the gate already in place would have been the wrong
  order.

## Alternatives considered

- **Policy document only** — rejected: makes the mission's "Never
  implement indiscriminate exploitation" promise unenforceable by
  anything except operator memory.
- **Cryptographically signed grants (e.g., a third-party notary
  signature)** — deferred, not rejected: adds real value but also real
  complexity (key management, a signing authority) disproportionate to
  this PR's scope. Revisit if/when a real authorized engagement occurs.
