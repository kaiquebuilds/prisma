# Prisma Roadmap (Epics)

This document is Prisma’s high-level roadmap. It lists the stable product areas (epics), their purpose, and a rough priority tier.

The source of truth for backlog status, ordering, and what is actually being worked on is the [project board](https://github.com/users/kaiquebuilds/projects/3/views/4?groupedBy%5BcolumnId%5D=249889331) and issues. This doc intentionally avoids listing slices and stories to prevent drift.

## How to read this roadmap

- Priority tiers:
  - P0: essential foundations, trust, and Brazil-reality capture
  - P1: control systems that deepen day-to-day usefulness without overwhelming
  - P2: optimization and power features, deeper analysis, and data portability
  - P3: nice-to-have security and convenience enhancements
- Epic numbers are stable identifiers, not ordering. Gaps are acceptable and expected over time.
- Epics are not a commitment to build everything, only a map of areas.

## P0 — Essentials, Trust, and Capturing Brazilian Reality

### Epic 0: Shipping Baseline

Make Prisma reliably runnable locally and deployable to staging and production, with the minimum operability required to ship continuously.

### Epic 1: Onboarding and First-Run Setup

Guide first-time users into a calm, non-overwhelming starting experience and highlight missing setup that would make guidance unreliable.

### Epic 2: Authentication, Verification, and Account Recovery

Provide secure account access and recovery flows appropriate for personal finance data.

### Epic 4: Profile and Account Settings

Provide the essential account and profile controls that make Prisma feel owned and safe to use.

### Epic 5: Privacy and “Public Mode”

Allow users to hide money values to safely use Prisma in public.

### Epic 6: Asset Accounts (Cash Containers) and Reconciliation

Provide the foundational “where is my money?” model and the ability to restore trust when balances drift.

### Epic 8: Transactions (Ledger) and Transaction Details

Enable manual-first capture of income and expenses with safe edit/delete behaviors and explainable balance updates. This epic also includes transfer-like ledger operations (between accounts and paying cards) as first-class transaction types.

### Epic 10: Recurrence Engine and Planned Items (Bills/Income/Transfers)

Move obligations out of the user’s head by modeling recurring bills and upcoming planned items.

### Epic 11: Planning Views (Timeline, Running Balance)

Show what’s due next and how it affects future balance to reduce surprise and anxiety.

### Epic 13: Safe to Spend, Buffers, and Confidence

Provide conservative, explainable “safe to spend today” guidance with graceful degradation when data is missing.

### Epic 16: Credit Cards (Brazil-Specific: Cycles, Invoices, Installments)

Model Brazilian credit card reality (cycles, invoices, installments) so Prisma reflects how people actually pay and commit money, even when they have cash available.

## P1 — Control Systems and Habit Reinforcement

### Epic 9: Categories, Tags, and Categorization Automation

Enable organization of spending and gradual automation to reduce ongoing manual work.

### Epic 12: Reminders and Notifications

Help users act on upcoming obligations at the right time without relying on memory.

### Epic 14: Financial Health Summary, Alerts, and Risk Forecasting

Give an at-a-glance view of stability/risk and warn early about likely problems.

### Epic 15: Goals, Reserves, and Progress Forecasting

Protect savings goals and forecast progress without breaking account balance integrity.

### Epic 19: Budgeting (Limits, Progress, Splits)

Provide category budgets and purchase splitting. Early budgeting should start as low-cognitive-load guardrails and deepen into full budgeting features over time.

### Epic 20: Search and Information Architecture

Reduce cognitive load by making it easy to find anything without remembering where it lives.

## P2 — Deeper Finance Modeling, Insights, and Portability

### Epic 17: Liabilities, Debt Payoff, and Net Worth

Track loans and payoff planning and unify assets/liabilities into net worth.

### Epic 18: Reporting, Dashboards, Charts, and Time Navigation

Enable deeper analysis, trend visualization, and forecasting over time.

### Epic 23: Data Import (Statements to Staging to Import)

Support importing transactions to reduce manual work without making bank integrations a requirement.

### Epic 24: Data Export (Portability)

Allow exporting Prisma data to CSV for portability and external analysis.

### Epic 25 – Sandbox Mode (What‑If Scenarios)

Let users safely simulate changes to upcoming cashflow and confirm actions with confidence by providing a session-only Sandbox that supports what-if edits and can atomically apply selected changes to real data.

## P3 — Convenience Features

### Epic 3: Sessions and Trusted Devices

Improve security and convenience with trusted device semantics and extended sessions where appropriate. Not required for Prisma’s initial value delivery.

## Merged / Deprecated Epics

### Epic 7: Transfers (Between Accounts and Paying Cards)

Merged into Epic 8 (Transactions). Transfers are modeled as first-class ledger operations to keep balances and reporting correct without artificial sequencing.

### Epic 21: Speed Capture (On the Go)

It is not an epic, but rather a cross-cutting concern addressed in multiple epics.

### Epic 22: UI Complexity Controls (Reduce Overwhelm)

Deprecated. Addressed as part of individual epic UX designs rather than a standalone epic.

## Non-negotiables (roadmap guardrails)

- Manual-first must be viable (no epic assumes bank syncing).
- Explainability over sophistication (guidance numbers must be explainable simply).
- Juliana sets the UX bar (if it’s too complex for her, it’s not Prisma yet).
- Trust over breadth (fewer features with high reliability beats many with low confidence).

## Planning fidelity rules

- Keep most backlog items as headlines.
- Only detail the next slice into “Ready” form.
- WIP limits:
  - Max 3 Ready items
  - Max 10 headline stories per epic before pausing and shipping something

## Related docs

- North Star outcomes: [`north-star.md`](./north-star.md)
- Definition of Done / Quality Gates: see product docs in `/docs/`
- Environment policies: `/docs/architecture/environments.md`
