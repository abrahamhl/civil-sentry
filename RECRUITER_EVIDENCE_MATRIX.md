# RECRUITER_EVIDENCE_MATRIX.md

Every row below was checked by actually running the command in the third
column against this PR's HEAD commit before this document was written —
not asserted from memory. See `abrahamhl/npm-supply-chain-auditor`'s
`RECRUITER_EVIDENCE.md` for the template this follows (same author, a
separate, shipped tool).

| Claim | Exact code / test evidence | Verified by running | What it proves | Limitation |
|---|---|---|---|---|
| An AI-generated Finding cannot claim `VERIFIED` without real evidence | `packages/core/src/ai-adapter.ts::acceptAiFinding` + `ai-adapter.test.ts` (4 cases) | `pnpm --filter @civil-sentry/core test` → 16/16 pass, incl. `rejects a VERIFIED finding with zero evidence IDs` | The grounding constraint is enforced at the function/type level, not by asking a model to behave | Only covers this codebase's own adapter contract — does not audit any external LLM's actual output for compliance with it |
| Active checks are blocked without a valid, scoped, unexpired authorization | `packages/core/src/authorization.ts::assertAuthorized` + `authorization.test.ts` (6 cases: missing/expired/wrong-org/out-of-scope/valid/passive-noop) | Same test run, all pass | Authorization is a runtime gate the code itself enforces, not a policy an operator can forget | Gates the software, not the operator's honesty about their own authorization document — see `docs/adr/ADR-001-authorization-gate.md` |
| Evidence tampering is detectable, not just discouraged | `packages/core/src/evidence.ts::verifyEvidenceChain` + `evidence.test.ts::"detects tampering with rawValue after capture"` | `pnpm --filter @civil-sentry/core test` | Real SHA-256 chain-of-custody, not a decorative field | Proves integrity of `rawValue` only; does not authenticate the original DNS response itself (no DNSSEC) |
| The reproducible synthetic demonstration actually runs the full pipeline, not a script of canned output | `fixtures/gelderland-synthetic/src/run-demo.ts` | `pnpm demo:synthetic` — real stdout: 3 fictional orgs processed, 1 genuine `MEDIUM/VERIFIED` finding raised on the org with no SPF record, gate blocks then allows, "9 Evidence objects captured, integrity verified" | The pipeline composes end to end (collector → evidence → finding → gate) using real function calls, not a demo mock | The DNS resolver is a canned lookup table for 3 fictional domains — no live network call is made in this demo, by design |
| Zero runtime dependencies across all three packages | `packages/*/package.json` (no `"dependencies"` key except intra-workspace `@civil-sentry/*` references) | `pnpm list -r --prod --depth -1` | Nothing was pulled in "just in case" | Will need to grow (e.g. for STIX serialization) — `docs/DEPENDENCY_POLICY.md` sets the bar for when that's justified |
| CI actually builds, tests, type-checks, and runs the demo on every push | `.github/workflows/ci.yml` | The Actions run linked on this PR | The claims above aren't just true on one machine | First CI run for this repository — no historical track record yet |
| Prior art was researched, not assumed, before any capability was called novel | `PRIOR_ART.md` (11 cited external sources + 4 directly-inspected own repositories) | Read `PRIOR_ART.md`; cross-check any citation | Capability claims in `GAP_MATRIX.md` are falsifiable, not asserted | Research pass was one afternoon, not exhaustive — `GAP_MATRIX.md` states this caveat explicitly wherever it applies |

## What this matrix intentionally does not claim yet

STIX 2.1 export, a geospatial UI, temporal/change detection, and any
`activeOnly` collector have **zero rows here** because they don't exist —
see `CURRENT_TRUTH.md`. A capability with no working code and no test gets
no row in this table, on principle: a claim without evidence is exactly
what this project exists to refuse to produce.
