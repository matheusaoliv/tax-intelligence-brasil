---
name: tax-engine-integrity
description: Use when inspecting, integrating, testing, upgrading, or changing any Brazilian tax calculation engine or fiscal rule in TAX INTELLIGENCE BRASIL. Preserve upstream behavior and require traceable evidence.
---

# Tax Engine Integrity

Before changing fiscal calculation behavior:

1. Read `AGENTS.md`, architecture docs, and the adapter/engine documentation.
2. Identify the authoritative upstream repository, exact version/commit, license, runtime, and published test vectors. If any are unknown, report the gap before implementation.
3. Treat upstream fiscal logic as authoritative for the selected engine version. Do not silently rewrite, approximate, normalize, or "correct" tax rules.
4. Keep adapters thin: validate/translate transport contracts, call the engine, preserve raw request/response evidence, and map errors without changing tax semantics.
5. Use decimal-safe representations. Never use binary floating-point for monetary arithmetic unless the upstream contract explicitly requires it and equivalence is proven.
6. Build golden tests from official or independently verified examples. Include boundaries, rounding, percentages, date transitions, optional fields, invalid input, and regression cases.
7. Compare adapter results with the upstream engine for identical inputs. Record engine version, fixture provenance, and any known divergence.
8. Do not let generative AI calculate, amend, or infer tax amounts. AI may explain a result only from versioned sources and must abstain when evidence is insufficient.
9. Preserve tenant isolation and avoid exposing taxpayer data in logs, prompts, traces, fixtures, or error messages.
10. Report commands actually run, results, untested paths, and unresolved legal/technical questions. Require human fiscal review for changes that can affect tax outcomes.

Completion requires reproducible evidence, not an assertion that the implementation "looks correct".
