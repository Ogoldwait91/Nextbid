# NextBid

NextBid is a smart, rule-aware bidding assistant for airline pilots – starting with British Airways' 777 fleet. It replaces manual bidding and IBID guesswork with a pilot-personalised bid generator that produces fully legal, optimised 15-line bid blocks ready to paste into IBID.  

---

## ✈ Product Vision

- Become the **primary bidding tool** used by BA 777 pilots.
- Replace manual bidding with a **rule-aware, personalised** engine.
- Reduce pilot workload, improve roster outcomes, and increase confidence in each bid. :contentReference[oaicite:2]{index=2}  

---

## 🧩 Core Problem We Solve

Pilots currently fight against:

- Complex monthly pairings
- Confusing JSS / Bidline rules
- No meaningful personalisation
- No forecasting of likelihoods
- High mental load and time consumption :contentReference[oaicite:3]{index=3}  

NextBid’s job is to **hide that complexity** and surface clear, high-quality bids.

---

## 🎯 Primary Goal

Generate **fully legal, personalised, optimised bidlines** that pilots paste directly into IBID. :contentReference[oaicite:4]{index=4}  

Success means:

- Pilots stop using IBID’s preview tools
- NextBid becomes the default bidding tool
- High trust in accuracy and legality
- Seamless UX
- Scalable to other fleets and airlines :contentReference[oaicite:5]{index=5}  

---

## 👥 Target Users

- **Primary:** BA 777 pilots  
- **Secondary:** Other BA fleets and, longer term, international carriers :contentReference[oaicite:6]{index=6}  

---

## 📦 MVP Scope

The 777 MVP focuses on: :contentReference[oaicite:7]{index=7}  

1. **Pairing ingestion** (PDF/text parsing)  
2. **Preference profile setup**  
3. **Rule engine** (Bidline + JSS logic enforcement)  
4. **Bid generator** (15-line optimised output)  
5. **Export-to-IBID** (copy-ready bid block)  

---

## 🗺 Roadmap Overview

See [`ROADMAP.md`](./ROADMAP.md) for full detail. Summary:

- **Phase 1 — Foundations:** data models, UI skeleton, ingestion v1, backend setup :contentReference[oaicite:8]{index=8}  
- **Phase 2 — Rule Engine:** convert Bidline rules & JSS syntax to JSON logic, enforce legality :contentReference[oaicite:9]{index=9}  
- **Phase 3 — Bid Generator:** scoring system, algorithm, overrides, IBID-ready output :contentReference[oaicite:10]{index=10}  
- **Phase 4 — Seniority & UX:** seniority heuristics, likelihood estimator, UX polish, explanation engine :contentReference[oaicite:11]{index=11}  
- **Phase 5 — Testing & Feedback:** BA 777 pilot testing, tuning, prepare for v1 release :contentReference[oaicite:12]{index=12}  

---

## 🛠 Tech Stack (Planned)

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, storage) or Firebase :contentReference[oaicite:13]{index=13}  
- **Parsing Engine:** Node / Python for PDF & text processing :contentReference[oaicite:14]{index=14}  
- **Rule Engine:** JSON-driven logic layer for Bidline / JSS :contentReference[oaicite:15]{index=15}  

---

## 🚧 Status

- [x] Project bootstrap (Next.js + TS + Tailwind)
- [x] Initial landing page / theme
- [ ] Core data models wired into the app
- [ ] Pairing ingestion prototype
- [ ] Rule engine v1
- [ ] 15-line bid generator v1
- [ ] IBID export v1

---

## 🧪 Local Development

```bash
npm install
npm run dev
# open http://localhost:3000
