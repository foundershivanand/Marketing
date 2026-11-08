# Content Guardrails & Negative Constraints Manual

## 1. Zero Tolerance Hallucination Policy
Under no circumstances may generated copy include:
- Revenue or MRR claims ($X ARR, $Y monthly recurring revenue)
- User, customer, or download metrics unless explicitly listed in `facts_json`
- Customer logos or enterprise endorsements without proof
- Third-party awards (e.g. "#1 Product of the Day", "Forbes 30 under 30")
- Compliance certifications (SOC2 Type II, HIPAA, ISO27001) unless documented in master profile

## 2. Character Limit Boundary Recovery
When a destination enforces tight length limits:
- **Tagline (max 60 chars):** Truncate strictly at the last whole word before 60 characters without breaking words.
- **Short Description (max 140–160 chars):** Produce a single self-contained value proposition.
- **Form Specific Text:** Strip all HTML, Markdown, and emojis if platform requires plain ASCII text.

## 3. Subreddit Community Compliance
Reddit strictly polices self-promotion under Rule 9 and community-specific guidelines:
- Submissions must never be pitched as ads.
- Must adopt the authentic founder persona: "I built X to solve Y, looking for honest feedback on Z".
- Always routed through `RedditDraftAdapter` for founder review before submission.
