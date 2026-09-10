# CIVIC-SENTRY

Evidence-driven cyber situational-awareness platform. It separates
**public observation** from **verified findings**, models **authorization
boundaries** as a runtime gate instead of a policy document, and refuses
to let an AI-generated Finding claim `VERIFIED` without a resolvable piece
of Evidence behind it.

## The problem

Public-administration bodies and SMEs are the most-targeted sector in the
EU (38.2% of incidents, per [ENISA's 2025 Threat Landscape](https://enisa.europa.eu/publications/enisa-threat-landscape-2025)),
and most low-cost "exposure scanning" tooling either (a) blurs the line
between a lawful public observation and an intrusive check, or (b) lets a
severity score get asserted with no traceable evidence behind it — which
is exactly the failure mode that erodes trust when a client or a
reviewer asks "how do you know?"

## What this is

A small, typed pipeline: `Organization → Asset → Observation → Evidence
→ Finding`, where every step from Observation onward is hashed,
confidence-tagged, and — for anything beyond lawful passive lookup —
gated behind an explicit, scope-checked authorization record. See
`docs/ARCHITECTURE.md` for the full diagram.

## What this is NOT

No credential attacks. No indiscriminate exploitation. No generic
scanning wrapper. See `THREAT_MODEL.md` for the hard boundary this
project enforces architecturally, not just by disclaimer.

## Actual evidence this works (not a claims list)

Everything below is checked by CI on every push — see the badge/run
linked on this repository's Actions tab, and `CURRENT_TRUTH.md` for the
line-by-line capability table with exact file paths.

- 3 packages, **zero runtime dependencies** (`docs/DEPENDENCY_POLICY.md`).
- An authorization gate tested against 6 explicit cases (missing grant,
  expired grant, wrong organization, out-of-scope target, valid grant,
  passive-mode no-op).
- An Evidence-tampering test that proves `verifyEvidenceChain()` actually
  catches a mutated `rawValue`.
- An AI-grounding test that proves a `VERIFIED` Finding is rejected
  outright when it has no linked Evidence.
- A reproducible synthetic demonstration (fictional Elzendaal district,
  Gelderland) that runs the entire pipeline end to end with no live
  network call, including the authorization gate blocking an
  unauthorized check and then allowing it once a valid grant is added.

## Try it

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm demo:synthetic
```

## Limitations (read before assuming more than this does)

STIX 2.1 export, a geospatial UI, temporal/change detection, and any
active-assessment collector are **not implemented yet** — see
`CURRENT_TRUTH.md` for the exact list and why each was sequenced this
way rather than rushed.

## How this was built

Human-decided scope, AI-assisted implementation, verified by tests that
either pass or don't — the same discipline documented in
[`civic-relay`'s interview case study](https://github.com/abrahamhl/civic-relay/blob/master/docs/WORKWIZE_CASE_STUDY.md)
for a different domain. `CURRENT_TRUTH.md` is the living record of what
that verification actually covers here.

## Documentation

- [`CURRENT_TRUTH.md`](CURRENT_TRUTH.md) — what's real, right now.
- [`THREAT_MODEL.md`](THREAT_MODEL.md) — STRIDE + MITRE ATT&CK/ATLAS applied to this system.
- [`GAP_MATRIX.md`](GAP_MATRIX.md) — novel vs. commodity vs. duplicative, classified honestly.
- [`PRIOR_ART.md`](PRIOR_ART.md) — the research this was built on top of, cited.
- [`RECRUITER_EVIDENCE_MATRIX.md`](RECRUITER_EVIDENCE_MATRIX.md) — claims mapped to exact code and tests.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the pipeline in detail.
- [`docs/adr/`](docs/adr/) — architecture decision records.

## Author

Abraham Haddioui · Arnhem, NL.

## License

Apache-2.0 — see [`LICENSE`](LICENSE).
