# Architecture

## Pipeline

```
Organization ──> Asset ──> Run (mode: STREET_PASSIVE | AUTHORIZED_ASSESSMENT)
                              │
                    ┌─────────┴─────────┐
                    │                   │
            passive collector    activeOnly collector
            (no gate needed)     (assertAuthorized() must pass first)
                    │                   │
                    └─────────┬─────────┘
                          Observation
                              │  observationToEvidence() — sha256 the rawValue
                              ▼
                          Evidence (immutable, hash-verifiable)
                              │
                          ┌───┴────────────────────┐
                          │                         │
                 deterministic rule         AI Analyst Adapter
                 (Finding.source =          (Finding.source =
                  DETERMINISTIC_RULE)        AI_ANALYST_ADAPTER,
                          │                  acceptAiFinding() rejects
                          │                  VERIFIED without evidenceIds)
                          └───────────┬─────────────┘
                                      ▼
                                   Finding
```

## Monorepo layout

- `packages/schema` — types only, zero runtime dependencies. `Confidence`,
  `Organization`, `Asset`, `AuthorizationGrant`, `Run`, `Observation`,
  `Evidence`, `Finding`.
- `packages/core` — the enforcement logic: `hash.ts` (sha256),
  `evidence.ts` (Evidence construction + integrity verification),
  `authorization.ts` (the gate), `ai-adapter.ts` (the VERIFIED-requires-
  evidence constraint).
- `packages/collectors` — deterministic, mode-tagged collection modules.
  Currently: passive DNS/MX/TXT (`dns.ts`). No `activeOnly` collector
  exists yet in this PR — see `CURRENT_TRUTH.md`.
- `fixtures/gelderland-synthetic` — the reproducible synthetic
  demonstration, wired as its own workspace package so it can depend on
  the real packages and run the full pipeline with a canned resolver.

## Key design decisions (see `docs/adr/` for the full record)

- **Evidence immutability by absence of API**, not storage-layer
  enforcement — no `updateEvidence` function exists anywhere in the
  codebase. Documented as a known limitation, not hidden (see
  `THREAT_MODEL.md` T-02).
- **Authorization is a runtime/type gate**, not a policy document alone —
  `assertAuthorized()` is the one path every `activeOnly` collector must
  call. See ADR-001.
- **Deterministic-AI-out-of-the-critical-path**: the AI Analyst Adapter
  is one of two ways to produce a `Finding` (the other being a
  deterministic rule), and both go through the exact same
  `acceptAiFinding` gate for the VERIFIED claim — the model's own output
  is treated as untrusted input, same as a raw DNS response.
- **Absence is evidence**: collectors emit an Observation per queried
  record type even when the result is empty, so a "no SPF record" Finding
  can cite real Evidence instead of an inference from silence.
