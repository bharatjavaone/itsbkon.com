# PCI DSS as a Platform Modernization Catalyst
**American Express · 2017–2019**

## The Mandate

American Express needed PCI DSS certification for accepting debit card payments in the UK market. The initial expectation was a compliance-focused effort: tokenize sensitive data, meet requirements, check the box.

That's not what happened.

---

## Seeing the Opportunity Inside the Mandate

When I looked at the scope of what PCI DSS tokenization required, I saw something else: an opportunity to fundamentally reshape the platform's architecture — at the same time, with the same team, funded by the same initiative.

The platform at this point was a monolith built over a decade. It worked — 99.99% availability proved that — but its architecture was aging. A future modernization effort would have been a separate initiative, a separate funding ask, a separate disruption to operations.

I created a proposal for executive leadership arguing that the PCI DSS mandate should be used as a catalyst for full platform modernization:
- Transform the monolith into a **microservices-based architecture**
- Introduce **event-driven design patterns**
- Implement **CQRS** (Command Query Responsibility Segregation)
- Deploy a **200GB+ Redis cache cluster** managing 20M+ customer records as a resilience layer
- Create the **cloud migration path** using the strangler pattern

---

## The Business Case

The ask was more time and more funding than a straight compliance effort. The counter-argument I had to overcome: why not just do compliance now and modernize later?

My answer: doing them sequentially costs more in total — in engineering time, in operational disruption, and in the window during which the platform remains on aging architecture. Doing both simultaneously is more expensive up front and cheaper in total. Leadership approved.

---

## The Migration Challenge

The hardest part wasn't architecture — it was data. The platform held **10+ years of transaction history: billions of records**.

Migrating that data had to be done with **near-zero downtime**. Any meaningful outage would have been felt immediately — the platform's APIs powered the Amex website and mobile app directly. I designed and led the migration plan, including the sequencing, rollback strategy, and validation approach to ensure no data was lost or corrupted in transit.

---

## Outcomes

- PCI DSS certification achieved for UK debit payments
- Platform architecture transformed: monolith → microservices with event-driven patterns and CQRS
- 200GB Redis cache cluster deployed — provided both a resilience fallback and a foundation for cloud migration
- 10+ years of transaction data (billions of records) migrated with near-zero downtime
- Platform architecture reshaped for years to come — the new foundation for all subsequent work

---

## The Principle

A CTO doesn't simply fulfill mandates. They identify the opportunity inside the mandate that creates disproportionate long-term value. PCI DSS was the mandate. The modernized platform architecture was the real win.
