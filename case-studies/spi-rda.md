# SPI Platform & Retirement Distribution Account
**Northwestern Mutual · 2021–2023**

## What We Were Building

Northwestern Mutual's first-ever embedded finance product: a bank account for retirees, seamlessly embedded in the NM experience. Customers would interact entirely with NM — they would never feel like they were working with another bank. Behind the scenes: a fully integrated banking partner, a custom API abstraction layer, and a customer journey that didn't exist anywhere in NM before.

---

## Phase 1: The Goldman Sachs Partnership (That Collapsed)

The project started as a lending initiative — enabling SBLOCs (Security Backed Lines of Credit) and CVLI loans (Lines of Credit backed by Cash Value Life Insurance). The initial banking partner was Goldman Sachs through their GS Select product.

We spent weeks aligning on API contracts and file specifications. The team was half-built. The build had begun.

Then the partnership collapsed. Contractual terms between NM and Goldman Sachs broke down, and the entire effort had to be abandoned.

---

## Phase 2: Six Months of Navigating Ambiguity

Business entered a ~6-month RFP process to find a new direction. I had a half-assembled team and no active project.

Rather than let the team sit idle, I used industry experience and domain expertise to create a plan. I personally researched general bank account opening journeys across multiple banks — Chime, Wealthfront, Betterment, and US Bank — going through their actual account opening flows as a customer. I analyzed what data was captured, in what order, and why.

This research had two purposes:
1. Build foundational understanding of what NM would need to design
2. Give the team something concrete to build toward before any partner was selected

---

## Phase 3: Building Ahead of the Decision

I had a hunch about where leadership would land — deposit accounts over lending, and a fintech-native partner. I had the team begin building core SPI backend API capabilities for a bank account opening journey using Q2's publicly available API documentation as a reference.

When Q2 was formally selected as the partner (with nbkc as the underlying bank), the foundational components were already built. This head start was critical to delivering the full product in 18 months from contract signing.

---

## The RFP Process

I led a 3–4 person team through the evaluation of 6–7 fintech partners: Treasury Prime, Galileo, Marqeta, Stripe, Rize, and Q2.

One of the most important contributions was challenging leadership's initial assumption: they expected a single partner to serve both lending and deposit account needs. Based on interviews and experience in both spaces, I recognized these are niche markets with specialized fintechs. Trying to find a generalist solution would have wasted months.

I presented the observation to leadership. They understood, narrowed the focus, and we selected Q2 with nbkc as the banking partner.

---

## Acting as Product Owner

There was no product counterpart assigned to this initiative. Someone had to define the customer journey.

I researched how Chime, Wealthfront, Betterment, and US Bank structured their account opening flows. I created a proposed customer journey for account opening that business later adopted as the basis for their actual process flows. I was simultaneously the engineer defining the API architecture and the product owner designing the customer experience.

---

## The RDA Product

The Retirement Distribution Account (RDA) works as a staging account for retirees:

- Advisors liquidate assets at optimal times — favorable market conditions, meeting Required Minimum Distributions
- Proceeds are deposited to cover approximately 6 months of anticipated income needs
- The distribution plan mimics the customer's paycheck from their working years
- The account is interest-yielding
- SPI abstracts all Q2 integrations (APIs, files) and exposes a personalized NM experience across the client website, mobile app, and advisor desktop

Customers interact with NM. The banking infrastructure is invisible.

---

## Delivery & Impact

- Launched to production **18 months from contract signing** (including a 2-month employee pilot)
- NM's first-ever embedded finance product
- Proven win-win-win: customers get a service no competitor offers, NM earns deposit revenue, the bank gets deposits
- SPI architecture is now the foundation for NM's Enterprise Partnership Platform — extensible to future partners using both deep integration and lightweight SSO patterns

---

## What This Proved

Heavily engaged fintech partnerships are viable at scale — and the abstraction layer pattern that hides partner complexity from the customer experience is reusable. Every future banking or fintech partner NM onboards can follow the same playbook.
