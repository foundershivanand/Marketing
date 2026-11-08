# LaunchPilot Agent Architecture & Guardrails

LaunchPilot deploys six specialized AI roles coordinated by Cloudflare Workflows, enforcing strict deterministic safeguards.

---

## Core Principle

> **"The AI decides what to write and how to map information. Deterministic code decides whether a destination is eligible for automated submission and performs the actual action."**

LaunchPilot never lets an LLM independently decide to click arbitrary buttons or submit forms on unallowlisted websites.

---

## The Six Agents

### 1. Directory Intelligence Agent (`prompts/research-agent.md`)
- **Objective:** Researches and verifies one startup submission destination.
- **Tasks:**
  - Visits destination and checks accessibility.
  - Identifies official submission URL.
  - Detects submission method (`form`, `api`, `email`, `manual`).
  - Detects login, fee, and automation restrictions.
- **Safeguard:** Never infers permission from the existence of a form. Unverified websites default to `unknown` policy.

### 2. Content Generation Agent (`prompts/content-agent.md`)
- **Objective:** Generates platform-specific copy (title, tagline, short/long description, tags).
- **Tasks:**
  - Adapts master product profile to specific platform character limits and audience tone.
- **Strict Negative Constraints:**
  - NEVER invents features, customers, revenue, testimonials, or awards.
  - STRICTLY ENFORCES the **"Things AI must never claim"** defined in the product master profile.

### 3. Submission Planning Agent (`prompts/planner-agent.md`)
- **Objective:** Validates policy eligibility, assigns adapter, and generates idempotency key.
- **Rules:**
  - Prohibits automated submission if destination policy is `prohibited` or `unknown`.
  - Enforces founder approval for Reddit communities and paid listings.
  - Generates stable idempotency keys (`idemp_{campaignId}_{destinationId}`) to eliminate duplicate submissions.

### 4. Browser Execution Agent (`prompts/browser-agent.md`)
- **Objective:** Cloud-only remote browser execution using Cloudflare Browser Run and Playwright.
- **Tasks:**
  - Interacts with permitted web forms on allowlisted domains.
  - Maps verified fields and uploads approved assets.
  - Captures confirmation screenshots and external IDs.
- **Safeguard:** Halts immediately when unexpected challenges, CAPTCHAs, or authentication barriers appear.

### 5. Submission Monitoring Agent (`prompts/monitoring-agent.md`)
- **Objective:** Monitors existing listings and schedules follow-up checks.
- **Schedule:** Day 0 (submit), Day 3 (check status), Day 7 (follow-up review), Day 14 & 30 (final outcome).
- **Rules:** Never sends unsolicited spam messages. Respects publisher guidelines.

### 6. Growth Analytics Agent (`prompts/analytics-agent.md`)
- **Objective:** Evaluates campaign ROI and traffic attribution via UTM links.
- **Output:** Destination performance rankings (`scale`, `maintain`, `drop`) based on real conversions.
