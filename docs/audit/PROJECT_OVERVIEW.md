# LaunchPilot Project Architecture & System Overview

## 1. Executive Summary

**LaunchPilot** is an autonomous, multi-product AI startup distribution engine built exclusively for serverless, cloud-native execution on the Cloudflare developer platform (Workers, D1, R2, Queues, Workflows, Browser Run).

Its core mission is to automate the 40+ hours founders spend manually researching, customizing, and submitting product profiles across 290+ startup directories, launch platforms, and developer communities imported from `PlacesToPostYourStartup`.

The system enforces a strict foundational invariant:
> *"The AI decides what to write and how to map information. Deterministic code decides whether a destination is eligible for automated submission and performs the actual action."*

---

## 2. System Architecture

```
                                      ┌─────────────────────────────────┐
                                      │       LaunchPilot Dashboard     │
                                      │    (React 18 + Vite + Tailwind) │
                                      └────────────────┬────────────────┘
                                                       │  REST API
                                                       ▼
                                      ┌─────────────────────────────────┐
                                      │   Cloudflare Worker API (Hono)  │
                                      │  Auth Middleware & Rate Limiting│
                                      └───────┬───────────────┬─────────┘
                                              │               │
                     ┌────────────────────────┘               └────────────────────────┐
                     ▼                                                                 ▼
         ┌───────────────────────┐                                         ┌───────────────────────┐
         │  Cloudflare D1 (SQL)  │                                         │   Campaign Workflow   │
         │  Relational Database  │                                         │ (Cloudflare Workflows)│
         └───────────────────────┘                                         └───────────┬───────────┘
                                                                                       │
                      ┌────────────────────────────────────────────────────────────────┼───────────────────────┐
                      ▼                                                                ▼                       ▼
           ┌──────────────────────┐                                         ┌─────────────────────┐ ┌──────────────────────┐
           │   Research Agent     │                                         │ Content Gen Agent   │ │   Planning Agent     │
           │  (Verify Destination)│                                         │ (Tailored Profiles) │ │  (Policy & Idemp.)   │
           └──────────────────────┘                                         └─────────────────────┘ └──────────┬───────────┘
                                                                                                               │
                                                      ┌────────────────────────────────────────────────────────┴─────┐
                                                      │                                                              │
                                            [Policy Permitted]                                            [Review Required]
                                                      │                                                              │
                                                      ▼                                                              ▼
                                         ┌─────────────────────────┐                                    ┌────────────────────────┐
                                         │ Cloudflare Submission   │                                    │ Founder Intervention   │
                                         │ Queue (Durable Retries) │                                    │ (CAPTCHA / Reddit / Fee)│
                                         └────────────┬────────────┘                                    └────────────────────────┘
                                                      │
                                                      ▼
                                         ┌─────────────────────────┐
                                         │     Queue Consumer      │
                                         │ (Rate Limits & Backoff) │
                                         └────────────┬────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       ▼                              ▼                              ▼
            ┌──────────────────────┐      ┌──────────────────────┐       ┌──────────────────────┐
            │   Directory Adapter  │      │ Cloud Browser Run    │       │ Email Pitch Adapter  │
            │  (Public Form POST)  │      │ (Playwright Session) │       │ (Editorial Outreach) │
            └──────────┬───────────┘      └───────────┬──────────┘       └──────────┬───────────┘
                       │                              │                             │
                       └──────────────────────────────┼─────────────────────────────┘
                                                      │
                                                      ▼
                                         ┌─────────────────────────┐
                                         │  Dead Letter Queue / R2 │
                                         │  (Screenshots & Audits) │
                                         └────────────┬────────────┘
                                                      │
                                                      ▼
                                         ┌─────────────────────────┐
                                         │ Growth Analytics Agent  │
                                         │ (UTM Traffic Tracking)  │
                                         └─────────────────────────┘
```

---

## 3. Technology Stack Breakdown

| Subsystem | Technology | Purpose & Implementation Details |
|---|---|---|
| **Frontend UI** | React 18, Vite 6, TypeScript 5.7, Tailwind CSS 3.4, Lucide Icons | Responsive single-page application with 8 operational mission control views. |
| **API Server** | Cloudflare Workers, Hono 4.6 | High-performance serverless REST API router with sub-millisecond cold starts. |
| **Relational Database** | Cloudflare D1 (SQLite engine) | 13 relational tables with composite indexes for multi-tenant product data. |
| **Local DB Shim** | Node.js `node:sqlite` DatabaseSync | Zero-dependency local development and memory test execution matching D1 API. |
| **Queueing & DLQ** | Cloudflare Queues | `launchpilot-submissions` queue with poison-message dead letter routing. |
| **Orchestration** | Cloudflare Workflows | Durable multi-step workflow execution engine with step persistence. |
| **Browser Execution** | Cloudflare Browser Run + `@cloudflare/playwright` | Remote headless browser execution in Cloudflare sandbox without local Chrome. |
| **Object Storage** | Cloudflare R2 | Storage of encrypted browser sessions, screenshots, and product marketing assets. |
| **Intelligence** | Gemini API (`gemini-1.5-pro`), OpenAI API (`gpt-4o-mini`), Mock Heuristic | Multi-provider fallback chain with circuit breaker and JSON auto-repair. |
| **Security Layer** | SSRF URL Guard, Web Crypto AES-256-GCM | Strict RFC1918 / loopback / metadata blocking, encrypted cookie states. |
| **Testing Harness** | Vitest 2.1 | Fast parallel unit and integration test runner covering all modules. |

---

## 4. Database Architecture & Data Models

The database schema is structured into 13 tables across two migrations:

1. `products`: Startup profiles, facts, and "Things AI must never claim".
2. `product_assets`: Asset metadata and R2 storage references (logos, screenshots, demo videos).
3. `destinations`: Platform catalogue imported from `PlacesToPostYourStartup`.
4. `destination_checks`: Historical accessibility and reachability logs.
5. `campaigns`: Groupings of distribution targets for a product.
6. `campaign_targets`: Individual submission targets with state tracking and idempotency keys.
7. `content_variants`: Platform-specific tailored copy generated by the Content Agent.
8. `submission_attempts`: Execution attempt history with screenshots and HTTP confirmation payloads.
9. `followups`: Scheduled post-submission check dates (Day 3, Day 7, Day 14).
10. `analytics_events`: Ingested UTM referral visits and signup conversions.
11. `audit_logs`: Immutable security and operational action audit trail.
12. `destination_throttles`: Destination circuit breakers and rate limit tracking.
13. `dead_letter_queue`: Storage for poison messages and persistent job failures.

---

## 5. Security & Isolation Boundaries

- **SSRF Protection:** Outbound requests validate protocols (strictly `http`/`https`), reject loopback (`127.0.0.1`, `::1`), private IP subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), cloud metadata (`169.254.169.254`, `metadata.google.internal`), decimal/hex IP bypass representations, and internal suffixes (`.local`, `.internal`).
- **Data Encryption:** Session states and sensitive credentials are encrypted using AES-256-GCM before persisting in R2 or local storage.
- **Idempotency Invariant:** Deterministic keys (`idemp_{campaignId}_{destinationId}`) prevent accidental duplicate submissions even when retried.
- **Zero Hallucination Ground Truth:** Product "Things AI must never claim" are parsed as negative constraints and deterministically cleansed from generated copy.
