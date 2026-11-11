# LaunchPilot Complete Pending Work Inventory

This document defines all pending fixes, completed remediations, testing gaps, and remaining infrastructure and operational tasks categorized by priority with acceptance criteria.

---

## 1. Remediated Tasks (Completed & Verified)

### TASK-01: Harden Authentication Middleware & Eliminate Insecure Backdoor
- **Priority:** P0 (Critical)
- **Status:** **COMPLETED & VERIFIED**
- **Affected Files:** `src/worker/middleware/auth.ts`, `tests/security/auth.test.ts`
- **Resolution:**
  Removed hardcoded `'admin-secret'` bypass. Separated `ADMIN_TOKEN` / `API_SECRET` from `ENCRYPTION_KEY`. Support added for Cloudflare Access (`CF-Access-Authenticated-User-Email`). Verified with 4 unit tests.

### TASK-02: Cryptographic Hardening of Key Derivation in AES-256-GCM
- **Priority:** P0 (Critical)
- **Status:** **COMPLETED & VERIFIED**
- **Affected Files:** `src/lib/security/encryption.ts`, `tests/security/encryption.test.ts`
- **Resolution:**
  Derived AES-256 keys by applying SHA-256 hashing to secret input. Disallowed weak default keys in production mode. Verified via encryption/decryption round-trip tests.

### TASK-03: Resolve Vitest Test Suite Concurrency Timeout
- **Priority:** P1 (High)
- **Status:** **COMPLETED & VERIFIED**
- **Affected Files:** `vitest.config.ts`
- **Resolution:**
  Configured `testTimeout: 15000` in `vitest.config.ts`. Full test suite now executes with 100% pass rate (67/67 tests passing across 21 test files).

### TASK-04: Implement Target Details & AI Draft Content Inspection Endpoint
- **Priority:** P1 (High)
- **Status:** **COMPLETED & VERIFIED**
- **Affected Files:** `src/worker/routes/submissions.ts`, `apps/web/src/lib/api.ts`, `apps/web/src/pages/Submissions.tsx`
- **Resolution:**
  Implemented `GET /api/submissions/targets/:id` endpoint. Updated the frontend Submissions page Intervention Modal to render the drafted post text for Reddit/email/manual platforms with 1-click clipboard copy.

### TASK-05: Bound In-Memory Rate Limiting Cache & Evict Expired Entries
- **Priority:** P2 (Medium)
- **Status:** **COMPLETED & VERIFIED**
- **Affected Files:** `src/worker/middleware/rate-limit.ts`
- **Resolution:**
  Added automatic pruning of expired entries and capped tracking map at 5,000 entries with LRU-style eviction of oldest keys.

### TASK-06: Persist AI Provider Settings in Web UI
- **Priority:** P2 (Medium)
- **Status:** **COMPLETED & VERIFIED**
- **Affected Files:** `apps/web/src/pages/Settings.tsx`
- **Resolution:**
  Implemented browser `localStorage` persistence and added a "Save AI Configuration" action button with visual feedback.

### TASK-07: Configurable CORS Origin
- **Priority:** P3 (Low)
- **Status:** **COMPLETED & VERIFIED**
- **Affected Files:** `src/worker/index.ts`
- **Resolution:**
  Read `ALLOWED_ORIGIN` environment variable allowing operators to restrict CORS in production while keeping wildcard for local development.

---

## 2. Active Pending Work & Production Deployment Tasks

### TASK-08: Remote Cloudflare D1 Production Migration
- **Task ID:** DEPLOY-01
- **Task Name:** Apply Remote Cloudflare D1 Migrations
- **Description:** Run database schema migrations `0001_initial_schema.sql` and `0002_scale_and_resilience.sql` against the live Cloudflare D1 production database instance.
- **Why Needed:** Required before live remote deployment to establish tables, indexes, and constraints on Cloudflare's global edge network.
- **Affected Files:** `migrations/*.sql`, `wrangler.jsonc`
- **Dependencies:** Valid Cloudflare API credentials and active D1 database binding (`launchpilot-db`).
- **Priority:** P1
- **Complexity:** Small
- **Recommended Approach:** Run `npx wrangler d1 migrations apply launchpilot-db --remote`.
- **Acceptance Criteria:**
  1. All 13 tables and composite indexes are created in remote D1.
  2. `wrangler d1 migrations list launchpilot-db --remote` shows all migrations applied.

### TASK-09: Production Cloudflare R2 Bucket Binding
- **Task ID:** DEPLOY-02
- **Task Name:** Provision & Bind Production R2 Bucket
- **Description:** Uncomment and configure the `r2_buckets` binding in `wrangler.jsonc` for `launchpilot-assets`.
- **Why Needed:** Required to store browser session cookies, confirmation screenshots, and founder-uploaded logos in production object storage.
- **Affected Files:** `wrangler.jsonc`
- **Dependencies:** Cloudflare R2 enabled on account.
- **Priority:** P1
- **Complexity:** Small
- **Recommended Approach:** Create R2 bucket `npx wrangler r2 bucket create launchpilot-assets` and enable binding in `wrangler.jsonc`.
- **Acceptance Criteria:**
  1. `ASSETS` binding accessible in worker environment.
  2. Attempt screenshots upload and retrieve without fallback errors.

### TASK-10: Cloudflare Access Zero Trust Dashboard Protection
- **Task ID:** DEPLOY-03
- **Task Name:** Enforce Cloudflare Access Zero Trust Gateway
- **Description:** Configure Cloudflare Access application rules on the production custom domain to enforce single sign-on (SSO) or email PIN authentication.
- **Why Needed:** Protects administrative endpoints and dashboard actions from unauthenticated public internet access.
- **Affected Files:** Cloudflare Zero Trust Dashboard, `src/worker/middleware/auth.ts`
- **Dependencies:** Custom domain routed through Cloudflare DNS.
- **Priority:** P1
- **Complexity:** Medium
- **Recommended Approach:** Create Cloudflare Access Application in Cloudflare Zero Trust dashboard with identity provider (Google Workspace, GitHub, or One-Time PIN).
- **Acceptance Criteria:**
  1. Direct dashboard navigation prompts for Cloudflare Access login.
  2. `CF-Access-Authenticated-User-Email` header passed through to worker and validated by `authMiddleware`.

### TASK-11: Automatic Sitemap & Robots.txt Discovery for Research Agent
- **Task ID:** ENHANCE-01
- **Task Name:** Sitemap and Robots.txt Parsing in Directory Intelligence Agent
- **Description:** Extend `src/agents/research.agent.ts` to inspect target destination `/sitemap.xml` and `/robots.txt` files for `/submit`, `/add-startup`, or `/listing` paths when standard HTML link discovery finds no direct submission form.
- **Why Needed:** Increases automated submission URL discovery rate on directories that don't place submission links in the main navigation bar.
- **Affected Files:** `src/agents/research.agent.ts`, `src/lib/security/url-guard.ts`
- **Dependencies:** Existing SSRF guard and HTTP fetch client.
- **Priority:** P2
- **Complexity:** Medium
- **Recommended Approach:** Add fallback step in `researchDestination` that fetches `robots.txt` and `sitemap.xml` using `safeFetch`.
- **Acceptance Criteria:**
  1. Discovers hidden submission paths listed in sitemaps.
  2. Respects crawl-delay and disallow directives.
