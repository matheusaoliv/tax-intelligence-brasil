---
name: multi-tenant-security-review
description: Use when designing or reviewing authentication, authorization, tenant boundaries, API keys, documents, storage, database queries, background jobs, webhooks, logs, or personal data in TAX INTELLIGENCE BRASIL.
---

# Multi-Tenant Security Review

Review the complete data path, not only the controller:

1. Identify the authenticated principal, active tenant, role, resource owner, and trust boundary.
2. Enforce tenant scoping server-side for every query and mutation. Never trust a tenant ID supplied only by the client.
3. Check object-level authorization for documents, calculations, exports, API keys, webhooks, and audit records.
4. Test cross-tenant access attempts for read, update, delete, download, search, and background-job execution.
5. Ensure queue messages, cache keys, object-storage paths, webhook deliveries, and scheduled tasks carry and validate tenant context.
6. Protect secrets and credentials. Do not commit secrets or expose them in logs, traces, URLs, prompts, or client bundles.
7. Minimize personal and taxpayer data. Define retention, access, deletion, and audit behavior consistent with approved product/legal requirements.
8. Check rate limits, replay protection, webhook signatures, idempotency, session expiry, and API-key scope where applicable.
9. Review database migrations and row-level security policies where used. Do not assume RLS replaces application authorization.
10. Add automated negative tests proving one tenant cannot access another tenant's resources.

Report each finding with affected path, realistic impact, reproduction/test evidence, and a minimal remediation. Do not claim an audit is complete if relevant paths or tests were not examined.
