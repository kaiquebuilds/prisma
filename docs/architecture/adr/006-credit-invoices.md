# ADR-006 — Credit Card Payment Modeling (Invoice-Level MVP)

## 1. Context

Prisma must model credit card payments in a way that supports:

- **Cashflow correctness** (invoice due dates, hard stops, Safe-to-Spend)
- **Debt-cycle realism** (partial payments, minimum due, revolving carried balance)
- **Manual-first simplicity** (no bank integrations; minimize required bookkeeping)

A naïve “pay each purchase” model is high effort and doesn’t match how users think about statements. Users typically think: **“I paid the invoice.”** They rarely allocate a payment across individual purchases/installments.

This ADR must align with:

- ADR-004 (partial payments + minimum due + carried balance; interest/fees manual)
- ADR-003 (budgets are competence-based; cashflow is impact-date-based)
- Consolidated planning engine ADR (invoice due events are obligations; payments are posted transactions)

## 2. Decision

1. Payments apply to the **invoice as a whole**.

   - Prisma does **not** allocate payments to individual purchases/installments in MVP.

2. An invoice derives the following computed values:

   - `statement_total` (sum of invoice charges: purchases + installments + carried balance from prior invoice, as applicable)
   - `minimum_due` (user-entered or configured per invoice; tracked explicitly)
   - `payments_total` (sum of payment events linked to this invoice)
   - `paid_at` timestamps (per payment event)
   - `interest_fees_adjustments` (manual line items, can be positive/negative)
   - `carried_balance = max(0, statement_total + adjustments − payments_total)`

3. The invoice can determine user-facing status (derived):

   - **Paid in full** if `payments_total >= statement_total + adjustments`
   - **Paid minimum** if `payments_total >= minimum_due`
   - **Below minimum** otherwise

4. For cashflow projections:
   - The invoice due FinancialEvent represents the **obligation**, but the _remaining due_ is derived as:
     `remaining_due = max(0, statement_total + adjustments − payments_total)`
   - Payments reduce that remaining obligation as they are posted.

## 3. Alternatives considered

1. **Allocate payments to purchases/installments**

   - Rejected for MVP: high complexity, poor UX, and doesn’t materially improve Safe-to-Spend accuracy.

2. **Single payment per invoice only**

   - Rejected: users often make multiple payments; supporting multiple events is necessary for realism.

3. **Auto-calculate minimum due / interest**

   - Rejected: issuer variability and high risk of being wrong. Minimum due may be shown on statements, but Prisma can’t reliably infer it in MVP.

4. **Treat invoice payments as category expenses**
   - Rejected: would double count (purchases already consumed budgets).

## 4. Consequences

### 4.1 Positive

- **Low cognitive load:** users record “I paid `R$ X` toward my invoice” without extra decisions.
- **Correct cashflow outcomes:** remaining due is well-defined and projections can incorporate partial payments.
- **Consistent with anxiety reduction:** status can clearly communicate “below minimum risk.”
- **Supports future complexity:** later you can add purchase-level allocation without breaking invoice-level correctness.

### 4.1 Negative (with mitigations)

- **No purchase-level payoff insights (e.g., “which purchases did I pay off?”)**

  - _Mitigation:_ explicitly scope MVP to invoice-level status; future iteration can add allocation or heuristic breakdown.

- **Potential confusion between “invoice charges” and “cash paid”**

  - _Mitigation:_ invoice UI should show a clear breakdown:
    - statement total
    - adjustments (interest/fees)
    - payments made
    - remaining due / carried balance

- **Risk of inconsistent totals if adjustments and statement total aren’t well-governed**
  - _Mitigation:_ enforce invariants and validation:
    - disallow negative remaining due
    - ensure carried balance derivation is mechanical
    - show warnings when minimum due > statement total, etc.
