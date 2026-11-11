# LaunchPilot Implementation Roadmap & Production Readiness

This roadmap details the sequential implementation batches and their completion status elevating LaunchPilot from initial audit to production-ready status.

---

## Batch 1: Critical Security & Test Stability (P0 / P1) — [COMPLETED & VERIFIED]
- [x] **TASK-01:** Remove hardcoded `'admin-secret'` and separate `ADMIN_TOKEN` from `ENCRYPTION_KEY` in `src/worker/middleware/auth.ts`.
- [x] **TASK-02:** Derive AES-256 keys via SHA-256 and remove vulnerable default fallback keys in `src/lib/security/encryption.ts`.
- [x] **TASK-03:** Update `vitest.config.ts` to configure `testTimeout: 15000` to prevent false-positive timeouts under parallel execution.
- **Verification:** Ran test suite (`npm test`) and typecheck (`tsc --noEmit`). 67/67 tests passing.

---

## Batch 2: Core Feature Completion & Integration (P1 / P2) — [COMPLETED & VERIFIED]
- [x] **TASK-04:** Add target details endpoint `GET /api/submissions/targets/:id` in `src/worker/routes/submissions.ts` returning the target record, associated product, destination, and latest content variant.
- [x] **TASK-05:** Update the Submissions UI (`apps/web/src/pages/Submissions.tsx`) so that the Human Intervention Modal displays the AI-prepared draft title, body, and fields with a 1-click "Copy to Clipboard" button.
- [x] **TASK-06:** Harden edge rate-limiting middleware (`src/worker/middleware/rate-limit.ts`) with bounded map capacity (5,000 max) and expired entry eviction.
- [x] **TASK-07:** Enable local persistence for AI provider configuration and API keys in `apps/web/src/pages/Settings.tsx`.
- **Verification:** Ran API tests and verified frontend build (`npm run build`).

---

## Batch 3: Reliability & Production Hardening (P2 / P3) — [COMPLETED & VERIFIED]
- [x] **TASK-08:** Secure CORS origins in `src/worker/index.ts` based on `ALLOWED_ORIGIN` environment variable with fallback for local development.
- [x] **TASK-09:** Add comprehensive end-to-end unit tests verifying target detail retrieval (`tests/api/api.test.ts`) and hardened auth middleware (`tests/security/auth.test.ts`).
- **Verification:** Full regression test pass across all 21 test files and clean production asset bundle (`dist/`).

---

## Batch 4: Cloud Deployment & Monitoring (Post-Release / Production Run)
- [ ] **DEPLOY-01:** Apply production Cloudflare D1 migrations (`wrangler d1 migrations apply launchpilot-db --remote`).
- [ ] **DEPLOY-02:** Bind production Cloudflare R2 asset bucket for session persistence and screenshots (`wrangler.jsonc`).
- [ ] **DEPLOY-03:** Configure Cloudflare Access application Zero Trust rules for dashboard URL protection.
- [ ] **ENHANCE-01:** Implement automated sitemap and robots.txt discovery in Directory Intelligence Agent.
