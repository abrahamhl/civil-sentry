# Security Policy

## Scope of this project

civil-sentry is a methodology showcase and evidence-pipeline
implementation. It ships **no active exploitation, no credential-attack
tooling, and no indiscriminate scanning capability** — see
`THREAT_MODEL.md` for the full boundary and why it is a hard architectural
constraint, not a disclaimer.

## Reporting a vulnerability in this codebase

Open a private security advisory on this repository, or contact the
author directly. Do not open a public issue for a suspected vulnerability
in the authorization gate, evidence-hashing, or AI-grounding logic —
those are exactly the components whose failure this project exists to
prevent, so a report there gets priority attention.

## What is explicitly out of scope for reports

- Findings against any *target domain* used in documentation examples —
  all example domains in this repository are synthetic
  (`*-fictional.nl`) and resolve to nothing real.
- Suggestions to add active scanning, credential testing, or exploitation
  features. These are deliberate non-goals — see the mission boundary in
  `THREAT_MODEL.md`.
