# LaunchPilot Bugs, Issues & Vulnerabilities Audit (Updated & Remediated)

This document details all discovered bugs, security vulnerabilities, edge-case flaws, and technical debt found during the audit, along with their resolution status.

---

## 1. CRITICAL Severity Issues

### BUG-01: Hardcoded Authentication Secret & Encryption Key Re-use in Auth Middleware
- **Affected File:** `src/worker/middleware/auth.ts`
- **Severity:** **CRITICAL**
- **Original Vulnerability:**
  1. A hardcoded string `'admin-secret'` allowed anyone on the internet to bypass authentication by passing `Authorization: Bearer admin-secret`.
  2. Reusing `ENCRYPTION_KEY` as an API bearer token compromised data encryption if API tokens were logged or exposed.
- **Status:** **REMEDIATED (Batch 1)**
- **Remediation Details:**
  Removed `'admin-secret'`. Separated `ADMIN_TOKEN` / `API_SECRET` from `ENCRYPTION_KEY`. Requests presenting `ENCRYPTION_KEY` or `'admin-secret'` are now rejected with HTTP 401. Verified with dedicated test suite `tests/security/auth.test.ts`.

---

## 2. HIGH Severity Issues

### BUG-02: Predictable Fallback Key & Insecure Key Derivation in AES-256-GCM Encryption
- **Affected File:** `src/lib/security/encryption.ts`
- **Severity:** **HIGH**
- **Original Vulnerability:**
  1. If `ENCRYPTION_KEY` was missing, sensitive user session tokens and cookies were encrypted using a hardcoded, publicly known key (`'default_launchpilot_fallback_key_32'`).
  2. Key derivation used naive string slicing and zero-padding (`secret.padEnd(32, '0').slice(0, 32)`), which created weak, low-entropy cryptographic keys if the secret was short.
- **Status:** **REMEDIATED (Batch 1)**
- **Remediation Details:**
  Replaced zero-padding with a SHA-256 digest (`crypto.subtle.digest('SHA-256', ...)`) to derive a uniform 256-bit CryptoKey. Required `ENCRYPTION_KEY` in production mode (throws an explicit configuration error if omitted).

### BUG-03: Vitest Test Suite Timeout Flakiness During Parallel Execution
- **Affected File:** `vitest.config.ts`
- **Severity:** **HIGH**
- **Original Vulnerability:**
  `vitest.config.ts` omitted `testTimeout`, causing Vitest to use default 5000ms. In high concurrency, worker threads competed and occasionally tipped over 5000ms.
- **Status:** **REMEDIATED (Batch 1)**
- **Remediation Details:**
  Configured `testTimeout: 15000` in `vitest.config.ts`. Full test suite now executes with 100% pass rate (67/67 tests passing).

### BUG-04: Missing Target Detail & AI-Generated Draft Retrieval Endpoint for Human Interventions
- **Affected Files:** `src/worker/routes/submissions.ts`, `apps/web/src/lib/api.ts`, `apps/web/src/pages/Submissions.tsx`
- **Severity:** **HIGH**
- **Original Vulnerability:**
  Founders in the UI could not inspect AI-prepared post titles and descriptions when reviewing Reddit communities or manual directory intervention tasks.
- **Status:** **REMEDIATED (Batch 2)**
- **Remediation Details:**
  1. Implemented `GET /api/submissions/targets/:id` endpoint returning `{ target, destination, product, campaign, content, attempts, latestAttempt }`.
  2. Added `getTargetDetail` in `api.ts`.
  3. Upgraded the Submissions UI Intervention Modal and Details Slide-Over to display the AI-prepared draft title, body, and fields with 1-click "Copy" buttons and direct links to destination submission pages.

---

## 3. MEDIUM Severity Issues

### BUG-05: Unbounded In-Memory Map in Rate Limiting Middleware
- **Affected File:** `src/worker/middleware/rate-limit.ts`
- **Severity:** **MEDIUM**
- **Original Vulnerability:**
  `Map` stored IP addresses indefinitely without eviction, creating a slow memory leak under sustained distributed traffic.
- **Status:** **REMEDIATED (Batch 2)**
- **Remediation Details:**
  Added automatic pruning of expired entries and capped the tracking map at 5,000 entries with eviction of oldest keys.

### BUG-06: Missing Persistence for AI Provider Settings in Web UI
- **Affected File:** `apps/web/src/pages/Settings.tsx`
- **Severity:** **MEDIUM**
- **Original Vulnerability:**
  AI provider selections and API keys were kept in ephemeral component state without saving.
- **Status:** **REMEDIATED (Batch 2)**
- **Remediation Details:**
  Implemented browser `localStorage` persistence and added a "Save AI Configuration" action button with visual confirmation.

---

## 4. LOW Severity Issues

### ISSUE-07: Wildcard CORS Configuration on Production API
- **Affected File:** `src/worker/index.ts`
- **Severity:** **LOW**
- **Status:** **REMEDIATED (Batch 2)**
- **Remediation Details:**
  Added environment variable support for `ALLOWED_ORIGIN` allowing production operators to restrict CORS to specific trusted domains while maintaining wildcard in development.
