# Dependency Policy

## The absolute rule

**`pnpm` only.** No `npm`, no `yarn`, no `bun`, no `pnpm dlx` for anything
that ends up in a committed lockfile. `packageManager` is pinned in the
root `package.json` (with a full integrity hash) and Corepack enforces it.

## Current dependency count (checked, not asserted)

**This policy's zero-dependency bar applies to the evidence pipeline:**
`packages/schema`, `packages/core`, `packages/collectors`, and the demo
fixture. As of this release those have **zero runtime dependencies**.
Two dev dependencies at the workspace root: `typescript`, `@types/node`.
Run `pnpm --filter @civil-sentry/schema --filter @civil-sentry/core
--filter @civil-sentry/collectors list --prod` to verify this yourself
— that command, not this sentence, is the source of truth.

`apps/web` (a marketing landing page, not part of the audited pipeline)
carries an ordinary React/Vite frontend stack — React, Three.js,
Leaflet, Framer Motion, Tailwind — added without going through the
vetting process below. That is a real gap against this policy, noted
here rather than hidden: this document's own rule ("any PR adding a
dependency without walking through this list is rejected on review")
was not followed for `apps/web`. Retroactively vetting it is a
follow-up, not yet done.

This is a deliberate outcome of the schema/core boundary: schema is pure
TypeScript types plus a handful of small validators (no reason to need a
library), and core's hashing/authorization/AI-grounding logic uses only
`node:crypto`, already in the runtime.

## Vetting process before adding anything

1. **Purpose** — is it strictly necessary, or does a Node native API cover
   it? (This is why `packages/collectors/src/dns.ts` uses `node:dns/promises`
   directly instead of a wrapper library.)
2. **License** — must be compatible with Apache-2.0 (MIT, Apache-2.0,
   BSD-* are fine; copyleft licenses need an explicit ADR).
3. **Maintenance** — actively maintained, no unpatched known CVEs.
4. **Transitives** — how many packages does it drag in? A single-purpose
   dependency with 40 transitives is a worse trade than writing 20 lines
   by hand.
5. **Supply-chain history** — checked against known compromised-package
   advisories. See `abrahamhl/npm-supply-chain-auditor` (a separate,
   shipped tool by the same author) for the class of threat this step
   guards against — this project does not depend on that tool, but the
   discipline it represents is why this policy exists.

Any PR adding a dependency without walking through this list in its
description is rejected on review, no exceptions for "it's just a small
one."

## When Zod (or similar) gets added

`packages/schema` currently validates externally-sourced content
(collector `rawValue`) with hand-written type guards, not a validation
library — see `docs/adr/` for when this changes. The trigger for
reconsidering is a growing external input surface (more collector types
ingesting more untrusted shapes), not a stylistic preference for runtime
schema validation.
