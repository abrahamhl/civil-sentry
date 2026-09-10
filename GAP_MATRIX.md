# GAP_MATRIX.md

Classification of every capability the mission brief proposes, against the
prior art documented in `PRIOR_ART.md`. Five labels only, per the brief's
own taxonomy: **NOVEL**, **USEFUL_INTEGRATION**, **COMMODITY**,
**DUPLICATIVE**, **UNSUPPORTED**. "Novel" is claimed only relative to the
specific tools this PR actually researched (OWASP Amass, SpiderFoot,
theHarvester, MISP, OpenCTI) — not as a claim about the entire global CTI/
bug-bounty-platform market, which was not exhaustively audited.

| # | Capability | Classification | Justification |
|---|---|---|---|
| 1 | Organization/Asset typed model | **USEFUL_INTEGRATION** | OWASP Amass already ships an "Open Asset Model" for this. Our schema follows the same graph-of-typed-nodes shape rather than inventing one; the integration is conceptual, not a code dependency. |
| 2 | Evidence provenance (hash-linked, immutable, source-attributed) | **USEFUL_INTEGRATION** | Standard digital-forensics chain-of-custody discipline, applied to OSINT/ASM collection where it is *not* standard practice (Amass/SpiderFoot/theHarvester do not hash their raw output). |
| 3 | Passive DNS/email(MX,TXT)/TLS observation | **COMMODITY** | Exactly what theHarvester, SpiderFoot, and Amass already do, at far greater scale and maturity. No superiority claimed; these collectors exist only because Evidence needs something to wrap. |
| 4 | Observation vs. Inference vs. Verified distinction | **NOVEL**\* | Among the OSS ASM/OSINT tools surveyed, none expose this as a type-enforced distinction. \*Caveat: the author's own unshipped `argus` design already specifies the identical `Confidence` enum (see `PRIOR_ART.md`); commercial CTI platforms were not audited for this feature. "Novel" means "novel among free/OSS tools examined." |
| 5 | Confidence scoring | **USEFUL_INTEGRATION** | Same caveat as #4 — the author's own prior design, integrated here, not invented fresh. |
| 6 | Geospatial organization view | **COMMODITY** | Rendering a map of asset locations is a solved UI problem. No novelty claimed; the value is in what data feeds the map, which is why `Organization.location` is already in the schema even though no map UI exists yet. |
| 7 | Temporal/change detection (retest & proof) | **USEFUL_INTEGRATION** | `argus`'s unshipped design already specifies `compareRuns(runA, runB): Proof[]` for exactly this — reused as a design pattern when built, not re-derived from scratch. |
| 8 | Evidence bundle (exportable run artifact) | **COMMODITY** | A JSON bundle-per-run is standard practice, including in `argus`'s own `.argusbundle` design. |
| 9 | STIX 2.1 export | **USEFUL_INTEGRATION** | STIX/TAXII is an OASIS standard with production adopters (CISA, EclecticIQ, SEKOIA). Mapping our model onto STIX Domain Objects is integration work, not invention — and is **UNSUPPORTED in this PR** (see `CURRENT_TRUTH.md`) because the internal schema needs to stabilize first. |
| 10 | Authorization gate blocking active checks without valid scope | **NOVEL**\* | None of Amass, SpiderFoot, or theHarvester enforce authorization *in the tool itself* — it's assumed to be a paperwork step outside the software. \*Caveat: bug-bounty platforms (HackerOne, Cobalt) likely enforce scope at the platform level — not audited here, so the claim is scoped to "novel among self-hosted OSS ASM tools." |
| 11 | AI analysis that cannot emit VERIFIED without evidence | **NOVEL**\* | Same caveat structure as #10. `argus`'s five-reviewer audit explicitly flagged "AI assigning severity/verified status" as *fake sophistication to avoid* — this project's constraint operationalizes that finding at the type level rather than restating it as policy. |
| 12 | Reproducible synthetic demonstration (fixtures, no live network) | **COMMODITY** | Standard test-engineering hygiene — `civic-relay` and `argus` both already do this for their own domains. |
| 13 | Commercial SME workflow (Public Exposure Snapshot → contact → authorization → assessment → remediation → retest → monitoring) | **DUPLICATIVE** | Near-verbatim `argus`'s own `Target → Evidence → Finding → Opportunity → Remediation → Retest → Proof` pipeline plus its Engineer/Client mode split — a design the same author already produced, unshipped, days earlier. **Deferred pending explicit decision** (see `CURRENT_TRUTH.md`): building a second, parallel implementation of the identical business workflow in a second repository is a duplication risk, not something to build reflexively. |
| 14 | Dependency governance (pnpm-only, Corepack, audited deps) | **COMMODITY** | Industry-standard hygiene, and the author's own established pattern (`argus/docs/DEPENDENCY_POLICY.md`, `npm-supply-chain-auditor`). Necessary baseline, not a differentiator by itself. |
| 15 | ADRs / threat modeling / structured audit docs as a process | **COMMODITY** | Standard senior-engineering practice. Its value is that it is *actually followed* (this document is an instance of it), not that the practice is unusual. |

## Net assessment

Two genuine differentiators survive scrutiny (#10 and #11, both scoped
honestly above), one meaningful integration of forensic rigor into OSINT
tooling (#2), and one duplication risk flagged for explicit decision
before more work goes into it (#13). Everything else is commodity or
reused design — not a weakness to hide; a recruiter can verify commodity
claims trivially, and a project that called only commodity capabilities
"novel" would fail the mission's own recruiter test.
