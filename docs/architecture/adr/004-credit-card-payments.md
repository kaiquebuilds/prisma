# ADR-004 — Credit Card Payments, Minimum Due, and Revolving Balance

## 1. Context

Prisma needs to model Brazilian credit card reality in a way that supports **hard-stop cash protection** while keeping the MVP manual-first and trustworthy:

- Users may pay **less than the statement total** (partial payments).
- Cards typically have a **minimum payment** requirement; paying below it triggers negative consequences.
- If payments are less than the statement total, the remaining amount becomes a **revolving carried balance** that impacts the next cycle.
- **Interest and fees** exist, but issuer calculations vary and are difficult to reproduce accurately without bank integrations.

This must align with Prisma’s broader engine decisions:

- Credit card invoices are **obligations** in the planning/projection timeline (not skippable).
- Budget attribution (“what I spent”) is separate from cashflow timing (“what hits my account”) per the dual-ledger approach.

## 2. Decision

1. Prisma supports **partial payments** for credit card invoices.

   - Users can record one or multiple payments against an invoice.
   - An invoice tracks a configured/entered **minimum payment** amount.

2. If total payments recorded for an invoice are **less than the statement total**, the unpaid portion becomes **carried balance** into the next invoice.

   - Carried balance is treated as part of the next cycle’s obligation context (it increases what the user owes overall).

3. **Interest and fees are not auto-calculated** in MVP.

   - They are tracked only as **explicit user-entered adjustments** (e.g., “interest,” “late fee,” “IOF,” etc.).
   - These adjustments must be represented in a way that clearly impacts:
     - the invoice total / carried balance, and
     - cashflow projections when due.

4. Prisma must surface whether the user is:
   - **Paid in full**
   - **Paid at least minimum**
   - **Below minimum / delinquent risk**
     based on invoice totals vs recorded payments.

## 3. Alternatives considered

1. **No partial payments (must pay full statement)**

   - Rejected: unrealistic for many users and prevents Prisma from supporting debt-cycle scenarios.

2. **Auto-calculate interest/fees**

   - Rejected for MVP: high risk of being wrong (issuer variability), which would erode trust and create false “safe-to-spend” outcomes.

3. **Treat credit card payments as category expenses**

   - Rejected: causes **double counting** (purchase already consumed budget; paying the invoice would consume budget again).

4. **Model carried balance implicitly (no explicit tracking)**
   - Rejected: reduces clarity and blocks anxiety-reducing guidance (“how much is rolling over?”).

## 4. Consequences

### 4.1 Positive

- **Realistic modeling** of revolving credit: users can reflect partial payments and carried balance accurately.
- Improves anxiety reduction by making risk states explicit: **paid in full vs minimum vs below minimum**.
- Maintains MVP correctness by requiring users to enter interest/fees **only when they actually occur**, avoiding incorrect automated estimates.
- Keeps consistency with the dual-ledger approach:
  - budgets track **spending attribution** (purchases/installments),
  - cashflow protection tracks **invoice due obligations** and payments timing.

### 4.1 Negative (with mitigations)

- Manual entry burden for interest/fees can reduce completeness.

  - **Mitigation:** provide lightweight UI prompts when an invoice is not paid in full (e.g., “Did you get charged interest/fees?” with optional quick-add adjustments), while keeping the default as “no adjustments.”

- Users may misunderstand carried balance vs new spending (and think Prisma “added” debt).

  - **Mitigation:** clearly separate invoice breakdown UI into:
    - **New purchases/installments** (this cycle)
    - **Carried balance from last cycle**
    - **Adjustments (interest/fees)**

- Risk of projection errors if invoice totals and payments are not kept consistent.

  - **Mitigation:** enforce invariants:
    - statement total must equal (new cycle components + carried + adjustments),
    - carried balance is mechanically derived when payments &lt; total,
    - prevent impossible states via validation.

- Potential conflict with “unified FinancialEvent” if invoice due is modeled as a single obligation but payments are multiple.
  - **Mitigation:** represent the invoice due as the obligation event, and represent payments as linked posted transactions; compute “remaining due” as a derived value for projections and UI.
