---
name: fiscal-adapter-contract
description: Use when creating or modifying an API adapter, DTO, schema, webhook, queue message, or service boundary that connects TAX INTELLIGENCE BRASIL to an upstream Receita Federal calculator or DANFSe generator.
---

# Fiscal Adapter Contract

1. Read the upstream API/schema and record the source version and retrieval date.
2. Define explicit request/response DTOs and validation. Preserve upstream field meaning, precision, codes, and optionality.
3. Separate transport errors, validation errors, upstream execution failures, and valid fiscal results.
4. Preserve raw upstream request and response in an access-controlled audit record, subject to data minimization and retention rules.
5. Add contract tests for valid, invalid, boundary, empty, null, unknown-field, timeout, retry, and upstream-version-change cases.
6. Verify idempotency for operations that may be retried. Do not retry non-idempotent operations without a documented strategy.
7. Version public contracts deliberately. Do not expose private upstream endpoints or internal implementation details as stable public API by accident.
8. Validate authentication, tenant context, authorization, quotas, and rate limits at the SaaS boundary.
9. Document mapping decisions and any unavoidable loss of information. Never silently discard fields that can affect fiscal interpretation.
10. Run focused tests and relevant type/lint/build checks. State exactly what was and was not executed.
