# Destination Anomaly Resolution Playbook

## 1. Single Page Applications (SPAs)
Modern startup directories frequently render form fields via client-side frameworks (React, Next.js, Svelte):
- The Browser Execution Agent waits for the `domcontentloaded` and network idle states.
- If selectors are initially hidden, retry after a 2-second stabilization window.
- If no form appears after rendering, flag for manual review rather than failing abruptly.

## 2. Dynamic Cookie Consent Banners
Many platforms display cookie modals that overlay the entire viewport:
- The Browser Service proactively inspects common consent selectors:
  - `#onetrust-accept-btn-handler`
  - `button[id*="cookie"]`, `button[class*="cookie"]`
  - `button:has-text("Accept All")`, `button:has-text("Allow all")`
- Automatically clicks accept to reveal the underlying form inputs.

## 3. Parked & Defunct Domains
- If the domain resolves to an auction/parking service (GoDaddy, Sedo, HugeDomains):
  - Mark `status: 'inactive'`
  - Update `confidence: 1.0`
  - Remove from active distribution campaigns to preserve worker execution cycles.
