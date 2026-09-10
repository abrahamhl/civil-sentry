# THREAT_MODEL.md — CIVIC-SENTRY as a system

**Scope of this document:** the threats CIVIC-SENTRY itself introduces or is
exposed to — not a sample threat model for a *target* it assesses (that
artifact, per-engagement, is `commercial/SAMPLE_REPORT.md`, not yet
written — see `CURRENT_TRUTH.md`). Method: STRIDE per component,
cross-checked against MITRE ATT&CK for the infrastructure-facing surface
and MITRE ATLAS for the AI-analysis surface (see `PRIOR_ART.md` for why
both frameworks apply and where they don't).

## 1. System overview

```
Operator ──> CLI ──> Mode Gate ──┬─> STREET_PASSIVE collectors (DNS, MX/TXT)
                                  └─> AUTHORIZED_ASSESSMENT collectors (gated by AuthorizationGrant)
                                               │
                                  Observation ──> Evidence (hashed, immutable) ──> Finding (Confidence-tagged)
                                                                                      │
                                                                AI Analyst Adapter ───┘ (optional, cannot emit VERIFIED ungrounded)
                                                                                      │
                                                                             Run Bundle (local, exportable)
```

## 2. Trust boundaries

| Boundary | Crossing | Control |
|---|---|---|
| Operator → Mode Gate | Operator selects `STREET_PASSIVE` or `AUTHORIZED_ASSESSMENT` | Mode is a typed, non-ambient property of a `Run`; no collector reads operator intent from free text |
| Mode Gate → Active collector | A collector tagged `activeOnly` attempts to run | `assertAuthorized()` throws unless a matching, unexpired `AuthorizationGrant` exists for the exact target |
| Collector → Evidence store | Raw observation becomes immutable Evidence | SHA-256 of `rawValue` computed at capture; `verifyEvidenceChain()` detects any later mutation |
| Evidence → AI Analyst Adapter | Adapter reads Evidence, proposes Findings | `acceptAiFinding()` cannot construct a Finding with `confidence: 'VERIFIED'` unless `evidenceIds` is non-empty and every ID resolves to real Evidence in the same run |
| Run Bundle → Export | STIX/JSON export leaves the local machine | Not yet implemented (`CURRENT_TRUTH.md`); when implemented, export requires an explicit operator action, never automatic |

## 3. STRIDE analysis

### Spoofing
- **T-01 — Forged `AuthorizationGrant`.** An operator fabricates a grant
  object to unlock active checks against an unauthorized target.
  **Mitigation:** grant records carry a `documentHash` field and the
  CLI (when built) is expected to print the scope back for visual
  confirmation before any active collector runs. **Residual risk:** this
  is process control, not cryptographic proof. Policing a malicious
  operator is an explicit non-goal — see `docs/adr/ADR-001-authorization-gate.md`.

### Tampering
- **T-02 — Evidence mutation post-capture.** Someone edits stored Evidence
  to change a Finding's outcome.
  **Mitigation:** `sha256` computed over `rawValue` at capture, checked by
  `verifyEvidenceChain()`; no `update` function exists anywhere in
  `packages/core` for an Evidence object — append-only by absence of API.
  **Gap (tracked):** this is enforced by absent API surface, not by
  storage-layer immutability (no filesystem permissions, no WORM store).
  Acceptable for a local-first single-operator tool.

### Repudiation
- **T-03 — "The AI said it was verified."** Directly the failure mode
  `civic-relay`'s synthetic "CCN-CERT reviewer" claims represent — an
  assertion with no attributable source.
  **Mitigation:** every Finding carries `evidenceIds`; every Evidence
  carries a `capturedAt` timestamp and traces back to an `Observation`
  with `collector`/`collectorVersion`. Temporal/change detection
  (mission requirement #7) builds on this once implemented.

### Information Disclosure
- **T-04 — Evidence bundle leaks more than authorized.** A DNS/MX/TXT
  observation on a real domain can incidentally capture internal
  hostnames or third-party vendor relationships out of scope.
  **Mitigation:** `Evidence.metadata.redacted` is reserved in the schema
  from day one so redaction isn't a retrofit.
  **Residual risk:** no redaction pipeline is coded yet — tracked in
  `GAP_MATRIX.md` and `CURRENT_TRUTH.md`.

### Denial of Service
- **T-05 — Passive collector misused as a DoS proxy.** Explicitly out of
  scope by design: `collectPassiveDns` performs exactly one query per
  record type per call — no retries-as-flood, no port sweep. A hard
  architectural constraint (`realDnsResolver` in `packages/collectors/src/dns.ts`),
  not a rate limiter bolted on afterward.

### Elevation of Privilege
- **T-06 — `STREET_PASSIVE` drifting into active behavior.** The single
  highest-value control in this threat model: a collector that starts
  passive and, through a careless change, begins sending crafted
  requests without the mode gate noticing.
  **Mitigation today:** collectors are tagged `passive`/`activeOnly` in
  `Observation.mode`, a schema-level declaration.
  **Documented open gap:** no CI check yet fails the build if a
  `passive`-tagged collector performs a network call inconsistent with
  its tag — tracked here explicitly rather than silently, per
  `GAP_MATRIX.md`.

## 4. AI-specific threat surface (MITRE ATLAS-informed)

| ATLAS-adjacent concern | Applies here? | Mitigation |
|---|---|---|
| Prompt injection via collected content (e.g., a hostile TXT record reaching an AI Analyst Adapter) | Yes — `Evidence.rawValue` is untrusted external content by definition | Adapter output is constrained to the typed `ProposedFinding` shape, not free text; `acceptAiFinding` treats the proposal's own confidence claim as untrusted input |
| Model hallucinating a `VERIFIED` finding with no supporting evidence | Yes — explicit mission requirement | Enforced at the function/type level (`acceptAiFinding`), not by system-prompt instruction alone |
| Data poisoning of a future fine-tuned/cached model | Not applicable — no model training occurs in this project | Revisit if that changes |

## 5. What this threat model deliberately does not cover

No credential-attack tooling, no indiscriminate exploitation, no
offensive payload delivery exists in this codebase to threat-model. A
future PR proposing any of those requires updating this document first,
and explicit operator sign-off before the code — not an engineering
decision made unilaterally.
