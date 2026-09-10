# PRIOR_ART.md

Research performed 2026-09-10 via live web search before any capability was
coded. Goal: prevent claiming novelty for anything that already exists, and
credit the author's own prior work honestly rather than implying more
integration than actually happened.

## 1. Standards bodies and public frameworks

| Source | What it actually defines | Relevance to civil-sentry |
|---|---|---|
| **NIST CSF 2.0** (Feb 2024) | 6 functions (Govern, Identify, Protect, Detect, Respond, Recover), 22 categories, 106 subcategories. Govern is new in 2.0. | Used as the outcome taxonomy for `Finding.category` — referenced, not reimplemented. No CSF conformance is claimed. |
| **ENISA Threat Landscape 2025** (published Oct 1, 2025; 4,875 incidents analyzed, Jul 2024–Jun 2025) | Public administration is the most-targeted EU sector (38.2% of incidents); converging cybercrime/espionage/hacktivism; AI-assisted attacks rising. | Grounds the "why this matters" framing in `README.md` with a cited, dated statistic. |
| **MITRE ATT&CK** vs **MITRE ATLAS** | ATT&CK: adversary behavior against conventional IT. ATLAS: AI/ML-specific techniques (prompt injection, data poisoning, model extraction), updated faster than ATT&CK, no ATT&CK equivalent. | `THREAT_MODEL.md` uses ATT&CK-style STRIDE for infrastructure and ATLAS explicitly for the AI-Analyst-Adapter surface — complementary, not interchangeable. |
| **OASIS STIX 2.1 / TAXII 2.1** | Approved as OASIS Standards 10 June 2021. Mandatory-to-implement serialization is UTF-8 JSON. Production implementers include CISA, EclecticIQ, SEKOIA, Trend Micro. | Target export format for `Finding`/`Evidence`. **Not implemented in this PR** — see `CURRENT_TRUTH.md`. |
| **OWASP Amass / Open Asset Model** | OWASP-hosted framework for external asset discovery + attack-surface mapping, with its own "Open Asset Model." | Direct prior art for `packages/schema`'s `Asset` type — same graph-of-typed-nodes pattern, not reimplemented wholesale. |
| **SpiderFoot** | Automated OSINT reconnaissance with a web UI, positioned for attack-surface mapping and threat intelligence. | Commodity capability for passive OSINT collection. Differentiation claimed is the Evidence/Confidence/Authorization layer, not collection breadth or speed. |
| **theHarvester** | E-mail, subdomain, name harvester from public sources. | Same category — commodity passive collection, cited so GAP_MATRIX's "COMMODITY" classification is defensible rather than asserted. |

## 2. CTI platforms (adjacent, not competing at this project's scale)

| Platform | Positioning | Why civil-sentry is not "a smaller OpenCTI" |
|---|---|---|
| **MISP** | Structured IOC sharing between trusted communities; strong feed ingestion, correlation, wide SIEM/IDS integration. | Assumes a contributing analyst community and inbound threat feeds. civil-sentry has neither — single-operator, single-target evidence pipeline. |
| **OpenCTI** | Knowledge-graph platform relating threat actors, malware, campaigns, TTPs; STIX-native; added MISP connectors in 2025. | Models *strategic* threat-actor intelligence. civil-sentry models *an organization's own external exposure* — closer to an ASM tool with a CTI-grade evidence layer. |

**Honest conclusion:** no gap exists for "another IOC-sharing platform" or
"another threat-actor graph." The defensible niche is evidence/
authorization/confidence discipline applied to external exposure
assessment for a defined organization, exportable as STIX for
interoperability — not a replacement for MISP or OpenCTI.

## 3. Author's own prior art (verified by direct repository inspection)

### `abrahamhl/argus` (private, 1 commit, 2026-09-07)
Inspected directly (cloned, read source). Reality: a governance skeleton —
a five-persona architecture review (`docs/FIVE_REVIEWER_AUDIT.md`), a
`Dependency Policy`, an `ADR-001-local-first.md`, and ~380 lines of
TypeScript implementing `Observation → Evidence → Finding → Opportunity →
Remediation → Retest → Proof` with the same `Confidence` enum
(`VERIFIED/SUPPORTED/INFERRED/UNKNOWN/CONTRADICTED`) this project uses.
**No tests are implemented** (`"test": "echo \"no tests yet\""` in every
`package.json`). **No CI exists.** A 10-PR implementation programme
(`docs/JULES_HANDOFF.md`) was written but never executed — one commit
total.

**What civil-sentry reuses:** the design decisions (Evidence immutability,
deterministic-AI-out-of-critical-path, pnpm-only discipline, the
Confidence vocabulary) — same author, same threat model, not copied code.
**What it does not reuse:** ARGUS is scoped to single-target SME
commercial assessment with a Dutch-language client mode; civil-sentry is
scoped to multi-organization situational awareness with authorization
boundaries and STIX interoperability. Kept as separate repositories so a
reviewer doesn't have to untangle a commercial consulting tool from a CTI
methodology showcase.

### `abrahamhl/npm-supply-chain-auditor` (public, shipped, tested)
Inspected directly. Real and finished: a single-file PowerShell forensic
scanner for the Shai-Hulud/ChainDrop npm worm family, with
`tests/Run-Tests.ps1` against synthetic fixtures, working GitHub Actions
CI, and its own `RECRUITER_EVIDENCE.md` mapping claims to exact code
lines — the direct template `RECRUITER_EVIDENCE_MATRIX.md` in this
project follows. Not integrated as code (different language, different
problem) but cited as evidence that shipping a small, honestly-scoped,
tested security tool is a demonstrated pattern for this author.

### `abrahamhl/graphify` (public fork)
Inspected directly: a **fork of a third-party product**
(`safishamsi/graphify`, a YC-backed codebase-to-knowledge-graph CLI). Not
the author's own IP and **not claimed as prior art**. Noted only so a
reviewer doesn't need to ask. No role in this project.

### `abrahamhl/civic-relay` (public, in-progress, unrelated domain)
Inspected directly. Different domain entirely (offline-first crisis
messaging), not touched by this work. Cited for one reason: its own
`docs/TRUTH_AUDIT.md` is a real, dated, self-published record of an AI
session fabricating a "93% institutional score" and a synthetic
"CCN-CERT reviewer" persona, later caught and retracted. That is the most
relevant prior art for *how this project's honesty discipline is
enforced* — evidence the failure mode is real for this exact author using
this exact tooling, not a hypothetical risk.

## 4. Commercial pricing research (grounding for a future `commercial/SERVICE_PACKAGES.md`)

Dutch penetration-testing market rates, 2025–2026, per multiple current NL
security-consultancy pricing pages: **€125–€250/hour** or
**€1,000–€2,000/day**; a grey-box web-app pentest by a certified tester
starts around **€3,000**; below that the market consensus is the
engagement is too shallow to be meaningful; full scopes commonly run
**€4,000–€15,000**, red-team engagements **€50,000+**. No
Gelderland-specific pricing differential was found — NL pricing is
scope-driven, not geography-driven. Reference point only; not a
commercial claim, and `commercial/*.md` is not yet written (see
`CURRENT_TRUTH.md` and `GAP_MATRIX.md` #13).

## Sources

- [STIX Version 2.1 — OASIS](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html)
- [STIX V2.1 and TAXII V2.1 OASIS Standards published](https://www.oasis-open.org/2021/06/23/stix-v2-1-and-taxii-v2-1-oasis-standards-are-published/)
- [TAXII Version 2.1 — OASIS](https://docs.oasis-open.org/cti/taxii/v2.1/os/taxii-v2.1-os.html)
- [MISP vs. OpenCTI: Updated 2025 Guide — Cosive](https://www.cosive.com/misp-vs-opencti)
- [Best Open Source Threat Intelligence Platforms — Cyware](https://www.cyware.com/blog/best-open-source-threat-intelligence-platforms)
- [OWASP Amass](https://owasp.org/www-project-amass/)
- [awesome-attack-surface-management — Escape Technologies](https://github.com/Escape-Technologies/awesome-attack-surface-management)
- [NIST CSF 2.0 overview — SecurityScorecard](https://securityscorecard.com/blog/examining-nist-csf-2-0-everything-you-need-to-know/)
- [ENISA Threat Landscape 2025](https://enisa.europa.eu/publications/enisa-threat-landscape-2025)
- [Reading the ENISA Threat Landscape 2025 report — Security Affairs](https://securityaffairs.com/182978/security/reading-the-enisa-threat-landscape-2025-report.html)
- [MITRE ATT&CK vs. MITRE ATLAS — Versa Networks](https://versa-networks.com/blog/mitre-attck-vs-atlas-ai-threat-frameworks/)
- [Wat kost een penetratietest? — IBgids](https://ibgids.nl/blog/wat-kost-een-penetratietest-prijzen-en-doorlooptijd)
- [Penetration Test Cost 2026 — Sectricity](https://sectricity.com/blog/how-much-does-a-pentest-cost/)
