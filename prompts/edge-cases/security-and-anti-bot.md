# Security & Anti-Bot Edge Case Manual

## 1. Challenge & CAPTCHA Detection
When a target destination presents any of the following challenges:
- Cloudflare Turnstile (`cf-turnstile`, `challenges.cloudflare.com`)
- Google reCAPTCHA v2 / v3 (`g-recaptcha`, `recaptcha/api.js`)
- hCaptcha (`hcaptcha.com`, `.h-captcha`)
- Arkose Labs / FunCaptcha
- AWS WAF Challenge

### Operational Protocol:
1. **Never attempt evasion or automated solver services.**
2. Immediately halt submission automation.
3. Capture full-page screenshot of the challenge interface.
4. Update `campaign_targets.status` to `manual_action_required`.
5. Create human intervention task with `intervention_type: 'captcha'`.
6. Notify founder on Mission Control dashboard with 1-click solve URL.

## 2. Authentication Walls & Login Gates
- If a form requires Google, GitHub, or email magic link login:
  - Check if encrypted founder session cookie exists in `session.service.ts`.
  - If no valid session exists, halt and flag `intervention_type: 'login'`.
  - **Never automate user signup or credential creation.**

## 3. Rate Limit & Cooldown Safeguards
- If a destination returns HTTP 429 or "Too many requests":
  - Exponential backoff is recorded in `destination_throttles`.
  - Place destination into 15 to 60 minute cooldown.
  - Queue message is delayed via Cloudflare Queues retry delay.
