
---

## 2️⃣ `ROADMAP.md` (detailed phases, from the PDF)

Create `ROADMAP.md` at repo root:

```markdown
# NextBid Roadmap

Aligned with **NextBid — Product Aim, Purpose, and Roadmap (v1.0)**. :contentReference[oaicite:17]{index=17}  

---

## Phase 1 — Foundations (Weeks 1–2)

**Goals:** Establish core models and the minimum UI to ingest pairings and store them. :contentReference[oaicite:18]{index=18}  

**Deliverables:**

- Data models:
  - `Pairing`
  - `PreferenceProfile`
  - `BidLine`
  - `BidPlan`
- UI skeleton:
  - Landing page
  - Simple dashboard shell
  - Pairing upload screen (777 only to start)
- Pairing ingestion & parser v1:
  - Upload PDF/text for BA 777 pairings
  - Extract key attributes (ID, dates, sectors, credit, layovers)
- Backend setup:
  - Supabase project
  - Tables for pairings, profiles, bid plans
  - Basic auth (pilot accounts, even if only for you initially)

---

## Phase 2 — Rule Engine (Weeks 3–4)

**Goals:** Convert Bidline + JSS rules into structured JSON logic and enforce legality. :contentReference[oaicite:19]{index=19}  

**Deliverables:**

- Rule representation:
  - JSON format for Bidline rules
  - Mapping between JSS syntax and internal model
- Validation:
  - Validate bidline structure (T01–T15)
  - Enforce priority ordering and mutual exclusivity
  - Detect illegal or conflicting bids
- Tooling:
  - Dev-only “rule inspector” UI for debugging rules
  - Unit tests for key rule scenarios

---

## Phase 3 — Bid Generator (Weeks 5–6)

**Goals:** Generate a full 15-line bid from preferences, rules, and available pairings. :contentReference[oaicite:20]{index=20}  

**Deliverables:**

- Scoring system:
  - Lifestyle score (days off, pattern spread, rest)
  - Pay score (credit hours, pattern values)
  - Fatigue score (night flights, ULR, pattern sequences)
- Generator v1:
  - Algorithm to build 15 lines ordered by score + legality
  - Ability to bias towards specific destinations/patterns
- User control:
  - Overrides (lock a bid line, force include/exclude pairings)
  - Simple editing of generated commands
- IBID export:
  - Single copy-ready text block
  - Check that format is IBID compatible

---

## Phase 4 — Seniority Logic & UX Polish (Weeks 7–8)

**Goals:** Make results feel realistic for a given seniority and polish the UI. :contentReference[oaicite:21]{index=21}  

**Deliverables:**

- Seniority heuristics:
  - Approximate what a given seniority is likely to hold
  - No fleet-wide dataset – purely heuristic at this stage
- Likelihood estimator:
  - “Likely / Possible / Unlikely” labels per bid line
- UX polish:
  - Clean, mobile-first flows (upload → preferences → bids)
  - Clear error and legality explanations
- Explanation engine:
  - For each bid line: “Why this?” explanation based on preferences and rules

---

## Phase 5 — Testing & Pilot Feedback (Week 9)

**Goals:** Validate the product with BA 777 pilots and tune it for v1 release. :contentReference[oaicite:22]{index=22}  

**Deliverables:**

- Pilot testing:
  - Trial with real 777 pairings and real preferences
- Debugging:
  - Fix rule inconsistencies
  - Adjust parsing edge cases
- Tuning:
  - Adjust scoring weights (lifestyle vs pay vs fatigue)
  - Refine likelihood heuristics
- Release prep:
  - Document limitations and assumptions
  - Decide on pricing/rollout strategy for 777 fleet

---
