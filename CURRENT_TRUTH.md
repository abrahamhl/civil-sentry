# CURRENT_TRUTH.md

**Date:** 2026-09-10
**Author:** Abraham Haddioui (AI-assisted, Claude Sonnet 5)
**Rule:** if it cannot be demonstrated with a command that exits 0, it is not claimed here as done.

> **Repo slug note:** this repository was created as `civil-sentry`
> (a typo — one letter off from the project's actual name, CIVIC-SENTRY)
> and is pending a rename by the owner. GitHub redirects the old slug
> automatically once renamed, so no link in this documentation breaks
> either way. Flagged here rather than left for a reviewer to wonder about.

This document states, without qualification inflation, what exists in this
repository at the point this PR is opened. It exists because the author's
adjacent repository (`civic-relay`) previously shipped a `README.md` and an
executive summary claiming a "93% institutional score" and "ENS Alto
compliance" for a prototype whose core delivery logic was later proven
broken by its own `docs/TRUTH_AUDIT.md`. That failure mode — AI-generated
synthetic scoring presented as external validation — is the single risk
this project is structured to make impossible. See `PRIOR_ART.md` for the
full account; it is cited here because it is the direct reason
`CURRENT_TRUTH.md` exists as a mandatory, continuously-updated artifact
rather than a one-time README claim.

## What this repository is, as of this commit

CIVIC-SENTRY is a new project. It is **not** a rename, fork, or continuation
of `civic-relay` (an unrelated offline-first crisis-messaging demo by the
same author — different domain, different codebase, not touched by this
work). It also does not import code from `abrahamhl/argus` (a private,
single-commit architecture skeleton by the same author, see `PRIOR_ART.md`)
— the pipeline vocabulary (Observation → Evidence → Finding, a
`Confidence` enum) is intentionally *convergent* with ARGUS's design
because both were authored with the same threat-modeling discipline, not
because files were copied.

## Implemented and proven in this PR

| Capability | Evidence | Command to verify |
|---|---|---|
| Org/Asset/Observation/Evidence/Finding schema (typed, zero runtime dependencies) | `packages/schema/src/*.ts` | `pnpm --filter @civic-sentry/schema build` |
| Confidence model (`VERIFIED`/`SUPPORTED`/`INFERRED`/`UNKNOWN`/`CONTRADICTED`) enforced at the type level | `packages/schema/src/confidence.ts` + `confidence.test.ts` | `pnpm --filter @civic-sentry/schema test` |
| Evidence immutability + SHA-256 provenance chain, with a tamper-detection test | `packages/core/src/evidence.ts` + `evidence.test.ts` | `pnpm --filter @civic-sentry/core test` |
| Authorization gate: `AUTHORIZED_ASSESSMENT` mode refuses to proceed without a valid, unexpired, scope-matching `AuthorizationGrant`; `STREET_PASSIVE` never needs one | `packages/core/src/authorization.ts` + `authorization.test.ts` (6 cases: missing/expired/wrong-org/out-of-scope/valid/passive-noop) | `pnpm --filter @civic-sentry/core test` |
| AI Analyst Adapter cannot emit a `VERIFIED` Finding without a resolvable evidence ID | `packages/core/src/ai-adapter.ts` + `ai-adapter.test.ts` | `pnpm --filter @civic-sentry/core test` |
| Passive DNS/MX/TXT observation — real Node `dns/promises` resolver, injectable for tests, one query pass, no active probing | `packages/collectors/src/dns.ts` + `dns.test.ts` | `pnpm --filter @civic-sentry/collectors test` |
| Reproducible synthetic demonstration — fictional Elzendaal district, 3 fictional orgs, full pipeline incl. authorization-gate block/allow | `fixtures/gelderland-synthetic/` | `pnpm demo:synthetic` |
| CI: install (frozen lockfile), build, test, type-check, and the synthetic demo on every push/PR | `.github/workflows/ci.yml` | GitHub Actions run linked on the PR |

## Explicitly NOT implemented yet (do not claim these)

| Capability requested in the mission brief | Status | Why deferred |
|---|---|---|
| STIX 2.1 bundle export | UNSUPPORTED | Exporting a still-changing internal schema and calling it "STIX 2.1 compliant" before the mapping is validated against the actual OASIS spec would itself be an overclaim (see `PRIOR_ART.md`) |
| Geospatial organization view (map UI) | UNSUPPORTED | No UI package exists yet; `Organization.location` is modeled in the schema so this is additive, not a rework, when it lands |
| TLS certificate transparency observation | UNSUPPORTED | Collector not yet written |
| Temporal/change detection between runs (`compareRuns`/Proof) | UNSUPPORTED | Requires a second run to diff against; the `argus` design for this (see `PRIOR_ART.md`) is the reference to reuse when this is built |
| `activeOnly` collectors (the thing the authorization gate actually gates) | UNSUPPORTED | The gate ships first, deliberately — see `docs/adr/ADR-001-authorization-gate.md` |
| Commercial workflow docs (`commercial/*.md`) | UNSUPPORTED | `GAP_MATRIX.md` #13 flags this as a likely duplication of `argus`'s own unshipped commercial pipeline — deferred pending an explicit decision, not forgotten |
| Publication gates (`PUBLICATION_MANIFEST.json`, sanitization/reproducibility reports) | UNSUPPORTED | Cannot honestly gate a repository that has one PR's worth of history |

## Known limitations of what IS implemented

- The synthetic fixture is fully fictional (no real organization, domain,
  or person — see the disclaimer in `fixtures/gelderland-synthetic/src/organizations.ts`).
  The passive DNS collector, when pointed at a real domain, performs real
  public DNS lookups — lawful, standard resolver behavior, not scanning.
- `sha256` hashing proves *evidence has not been mutated after capture*.
  It proves nothing about the underlying DNS response's authenticity —
  DNSSEC validation is not implemented.
- The authorization gate is enforced in application code, not
  cryptographically signed. See `docs/adr/ADR-001-authorization-gate.md`
  for the residual-risk discussion.
- No production deployment exists. Local-first, single-operator tool,
  matching the same principle in `argus` (see `PRIOR_ART.md`).

## Repository hygiene baseline (checked, not assumed)

- `pnpm` only, `packageManager` pinned in root `package.json`, Corepack-enabled.
- `pnpm-lock.yaml` will be committed once `pnpm install` is run in CI/locally
  — the opposite mistake from `civic-relay`, where the lockfile was
  gitignored (see `PRIOR_ART.md`).
- CI triggers on `main` (the repository's actual default branch) and on
  pull requests targeting it.

**Next update to this file is mandatory at every PR** that changes the
capability table above. A stale `CURRENT_TRUTH.md` is treated as a bug.
