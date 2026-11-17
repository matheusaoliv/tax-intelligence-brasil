---
name: engineering-tdd
description: Use for implementing features, fixing bugs, refactoring, or changing tests in TAX INTELLIGENCE BRASIL. Apply a test-first workflow and verify every claimed result.
---

# Engineering TDD

1. Read `AGENTS.md` and the relevant architecture/module documentation before editing.
2. State the expected behavior and acceptance criteria. Identify the smallest reproducible case.
3. Inspect existing tests and conventions. Add or update a test that captures the expected behavior before changing production code.
4. Run the focused test and record its actual result. For a bug, confirm that the regression test fails for the intended reason.
5. Implement the smallest coherent change. Avoid unrelated refactors and speculative abstractions.
6. Run the focused test again, then the relevant test suite, lint, typecheck, and build where available.
7. For failures, debug from evidence. Do not weaken assertions, delete tests, or suppress errors just to obtain a green run.
8. Review the diff for regressions, security, tenant isolation, privacy, API compatibility, migrations, and observability.
9. Add regression coverage for every bug fix. For risky logic, consider property-based and boundary tests.
10. Report exact commands and outcomes. Distinguish passed, failed, skipped, and not-run checks. Never claim a check passed without running it.

For fiscal behavior, also invoke `tax-engine-integrity`. For tenant/auth/data paths, also invoke `multi-tenant-security-review`. For external engine/API boundaries, also invoke `fiscal-adapter-contract`.

A task is not complete merely because code was written. Completion requires reproducible verification and explicit disclosure of remaining gaps.
