# LaunchPilot — Multi-Product AI Startup Distribution Platform

<p align="center">
  <strong>Write Once. Distribute Everywhere. Measure Everything.</strong>
</p>

LaunchPilot is an autonomous, cloud-only startup distribution engine built to eliminate the 40+ hours founders waste on repetitive directory submissions. It imports the 100+ launch platforms and directories from [mmccaff/PlacesToPostYourStartup](https://github.com/mmccaff/PlacesToPostYourStartup) and coordinates six specialized AI agents to research destinations, tailor content, enforce anti-spam policies, and execute submissions.

---

## Architecture Overview

```
                                      ┌─────────────────────────────────┐
                                      │       LaunchPilot Dashboard     │
                                      │    (React + Vite + Tailwind)    │
                                      └────────────────┬────────────────┘
                                                       │
                                                       ▼
                                      ┌─────────────────────────────────┐
                                      │   Cloudflare Worker API (Hono)  │
                                      └───────┬───────────────┬─────────┘
                                              │               │
                     ┌────────────────────────┘               └────────────────────────┐
                     ▼                                                                 ▼
         ┌───────────────────────┐                                         ┌───────────────────────┐
         │  Cloudflare D1 (SQL)  │                                         │   Campaign Workflow   │
         │  Relational Storage   │                                         │  (Durable Workflows)  │
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
                                         │ Cloudflare Submission   │                                    │ Human Intervention     │
                                         │ Queue (Durable Retries) │                                    │ (CAPTCHA / Reddit / Fee)│
                                         └────────────┬────────────┘                                    └────────────────────────┘
                                                      │
                                                      ▼
                                         ┌─────────────────────────┐
                                         │  Submission Dispatcher  │
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
                                         │   Audit Log & Evidence  │
                                         │  (Screenshots in R2)    │
                                         └────────────┬────────────┘
                                                      │
                                                      ▼
                                         ┌─────────────────────────┐
                                         │ Growth Analytics Agent  │
                                         │ (UTM Traffic Tracking)  │
                                         └─────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide | Responsive Mission Control Dashboard |
| **Backend API** | Cloudflare Workers, Hono | High-performance edge API with Zero Trust auth |
| **Database** | Cloudflare D1 (SQLite) | Relational database (Products, Destinations, Campaigns, Targets) |
| **Object Storage** | Cloudflare R2 | Browser sessions, product assets, screenshot evidence |
| **Queue** | Cloudflare Queues | `launchpilot-submissions` & `launchpilot-dlq` with exponential retries |
| **Orchestration**| Cloudflare Workflows | Durable multi-step agent orchestration |
| **Browser** | Cloudflare Browser Run + Playwright | Remote headless browser execution without local Chrome |
| **Intelligence**| Gemini & OpenAI provider adapters | Research, content adaptation, and growth analytics |
| **Security** | SSRF URL Guard & AES-256-GCM | Private IP filtering, untrusted HTML guard, encrypted tokens |

---

## Directory Sources (100+ Platforms)

Imported directly from [mmccaff/PlacesToPostYourStartup](https://github.com/mmccaff/PlacesToPostYourStartup):

- **Reddit Communities (19):** `/r/SideProject`, `/r/SaaS`, `/r/Entrepreneur`, `/r/IMadeThis`, `/r/buildinpublic`, `/r/indiehackers`, `/r/microsaas`, `/r/RoastMyStartup`, etc.
  - *Safeguard:* Enforces human founder review per Reddit's anti-spam policy.
- **Product Launch Platforms & Directories (72+):** Product Hunt, SaaSHub, Launching Next, PitchWall, F6S, BetaBound, CrozDesk, Killer Startups, StartupBase, etc.
- **Editorial & Media:** MakeUseOf, The Changelog, Arctic Startup, etc.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database with PlacesToPostYourStartup
```bash
npm run seed
```
This imports all 100+ destinations from GitHub, creates a sample product master profile with strict negative constraints, launches an initial campaign, and seeds UTM analytics.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173). The frontend and backend run seamlessly with hot-reloading on a unified port.

### 4. Run Test Suite
```bash
npm test
```
Executes comprehensive Vitest tests for:
- SSRF URL Guard (IP ranges, metadata blocking, protocol checks)
- AES-256-GCM session encryption & decryption
- GitHub README markdown parsing and domain normalization
- Adapter routing & Reddit spam safeguards
- Submission Planner idempotency and policy gates
- End-to-end Campaign Workflow orchestration

### 5. Production Build & Deployment
```bash
# Build frontend assets
npm run build

# Deploy to Cloudflare Workers
npm run worker:deploy
```

---

## Production Safeguards

| Safeguard | Implementation |
|---|---|
| **Zero Hallucination** | Negative constraints ("Things AI must never claim") strictly enforced in prompts and validated via Zod schemas. |
| **No Duplicate Submissions**| Deterministic idempotency keys (`idemp_{campaignId}_{destinationId}`) and locks prevent re-submitting. |
| **SSRF Protection** | Outbound requests strictly block loopback, RFC1918, link-local metadata (169.254.169.254), and non-http(s) protocols. |
| **Reddit Anti-Spam** | Reddit destinations are classified as `requires_review`. AI prepares drafts for the founder to inspect and post manually. |
| **Paid Listings Guard** | Platforms with submission fees trigger a `payment` approval gate before any funds can be charged. |
| **Encrypted Sessions** | Browser cookies and session states are encrypted with AES-256-GCM before persisting in R2 storage. |

---

## License

MIT License. Designed and architected for autonomous startup distribution.
