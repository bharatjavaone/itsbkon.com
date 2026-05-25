# Global Money Movement Platform
**American Express · 2006–2021**

## The Starting Point

In 2006, the platform was a US-only bill pay system for American Express cardholders. By the time I left in 2021, it was processing payments for 30+ countries, across every major payment paradigm, moving $1 trillion+ annually — with 99.99% availability for 10 consecutive years.

None of that growth was handed down as a roadmap. Every expansion was a proposal, a business case, a win, and then an execution.

---

## The International Expansion Decision

When the US bill pay platform proved successful, Amex leadership set an ambition to make it the centralized money movement platform for all global markets. The conventional path would have been to extend the existing US platform to support international currencies, time zones, and market-specific payment methods.

I proposed something different: **build a separate instance of the platform for international markets** rather than extending the US one.

This went against the prevailing view. I had to make the case to leadership.

**The reasoning that won the argument:**
- The US market is Amex's highest-volume market by far. Any deployment window during US off-peak hours falls squarely on peak hours in UK, India, and other markets — creating unavoidable risk.
- The platform operated on a zero-outage principle. A shared codebase would mean every US release carried risk for international markets and vice versa. Separation eliminated that coupling entirely.
- International markets had fundamentally different payment rails, regulatory requirements, currencies, and operational models — this wasn't a localization problem, it was an architectural one.

**The execution:** Led the design, development, and rollout of the international platform across four markets in sequence — UK, India, Hong Kong, and Mexico — each with its own regulatory complexity and no established playbook.

---

## The Business Expansion Story

Beyond geography, the platform grew into entirely new business lines through a series of proposals — each one identifying an opportunity and making the case for how the platform could capture it.

**Stage 1 — C2B (original):** Bill payment processing for Amex card customers in the US.

**Stage 2 — Merchant Financing (first B2C expansion):** Business stakeholders needed a platform for a new initiative — Merchant Financing for small businesses and merchants. I created a proposal showing how the existing platform's capabilities could be extended. The proposal won. This opened the door to:
- Debit ACH initiative
- AP Automation (accounts payable)
- Working Capital Terms — working capital for small businesses based on invoiced amounts

**Stage 3 — B2B:** Business stakeholders brought demand for Business-to-Business money movement. Created a proposal, won it, and led the design and launch of B2B payment capabilities.

**Stage 4 — P2P:** PayPal/Venmo partnership enabling peer-to-peer "Send and Split" for Amex cardholders.

---

## New Channels — Beyond Web and Mobile

**Payments by Text (UK and India):**
Two customer scenarios were enabled through SMS:
- *Past-limit purchases:* when a transaction is declined for exceeding a credit limit, the customer receives an Amex text. Responding to that text can pay the overage and complete the transaction.
- *Past-due dunning:* customers receiving payment reminders can respond directly to make a payment.

Authentication in a text channel with no login session required creative thinking. In the UK market, customers responded with the CVV2 of their stored debit card — a value Amex already held on file. I designed and delivered this authentication model as part of the launch across UK and India.

**Alexa Skill Integration:**
Extended the platform's APIs to support Amex's Alexa skill, enabling customers to inquire about bank accounts and initiate payments entirely through voice. Worked through authentication and payment authorization within the Alexa skill architecture's constraints — no screen, no session, no tap-to-confirm.

---

## Scale at Departure (2021)

| Metric | Value |
|--------|-------|
| Annual payment volume | $1T+ |
| Customers served | 80M+ |
| Daily API calls | 15M+ |
| Daily payments processed | 1M+ |
| Platform availability | 99.99% for 10 consecutive years |
| Countries / markets | 30+ |
| Initiatives delivered annually | 50+ |

---

## The Lesson

A platform that started as a US card customer bill pay engine ended up supporting every major payment paradigm across 30+ countries. That didn't happen because of a roadmap. It happened because someone kept seeing what it could become next — and kept making the case.
