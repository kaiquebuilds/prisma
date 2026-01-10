# ADR-003 — Dual-Ledger Semantics: Budget (Competence) vs Cashflow (Impact Date)

## 1. Context

Prisma needs to support two “truths” that users intuitively separate:

1. **Spending attribution (“What did I spend this month?”)**
   Users expect category budgets to reflect **when the purchase happened** (or when the installment’s competence applies), not when the money leaves their checking account.

2. **Cash protection (“Will I have money to pay what’s due?”)**
   Safe-to-Spend and hard stops must reflect **when cash is actually required**, e.g.:
   - bill due dates
   - credit card **invoice due dates**
   - income dates

This separation is especially important with credit cards because:

- a purchase can happen in Month A,
- be assigned to an invoice that closes in Month A or B,
- but hit cash only at the **due date** (often Month B).

Without explicit dual semantics, Prisma will either:

- mislead users on budgets (competence mismatch), or
- mislead users on safety (cash timing mismatch).

This ADR must remain consistent with Prisma’s consolidated decisions:

- a unified **FinancialEvent** timeline powers projections and CashHeadroom,
- predicted items can **reserve budget** for alignment,
- card invoices are **obligations** (not skippable).

## 2. Decision

### 2.1 Budget ledger uses **competence month**

- **Budget consumption** is recorded against the **competence month**:
  - For a **credit card purchase**, competence is the **calendar month of the purchase/posted date** in the user’s configured timezone (**competitor-aligned**).
  - For **installments**, each installment consumes budget in its own competence month (the month the installment is attributed to).

In other words, budgets answer: **“Which month does this spending belong to?”**

### 2.2 Cashflow ledger uses **cash impact date**

- **Cashflow protection** (Safe-to-Spend, CashHeadroom) is driven by dates that can impact aggregate checking cash between today and EOM:
  - bill due dates
  - invoice due dates (and partial invoice payments if applicable)
  - income dates
  - other dated obligations

Cashflow answers: **“On which date must I have the money available?”**

### 2.3 Interlock between the two ledgers (to avoid contradictions)

- Prisma treats **invoice due events** (cashflow) as obligations in the FinancialEvent timeline.
- Prisma treats category budgets as being consumed by:
  - **posted** transactions in the competence month, plus
  - **reserved** predicted transactions (where applicable) in the competence month,
    while ensuring invoice due events do **not** double-consume category budgets.

The practical rule is:

- **Budgets** track _spend attribution_ (competence), not invoice payments.
- **Cashflow** tracks _payment obligations_ (impact dates), not category allocations.
- **Credit card invoice payments are not categorized as expenses** and must not consume category budgets (to avoid double counting).

## 3. Alternatives considered

1. **Single-ledger model (everything by transaction date)**

   - Pro: simplest.
   - Con: breaks cash safety with credit cards (spend date ≠ cash impact), undermining Safe-to-Spend.

2. **Single-ledger model (everything by cash impact date)**

   - Pro: cash correctness.
   - Con: budgets become unintuitive (“I bought groceries last month but it shows this month”), harming planning and habit formation.

3. **Budget by invoice month (instead of purchase month)**

   - Pro: matches many users’ mental model of “this statement’s spending.”
   - Con: changes attribution when closing boundaries move; can confuse users who think in purchase date terms.

4. **Budget by purchase month for card spend, but also count invoice payments as category spend**
   - Pro: feels like “everything is accounted for.”
   - Con: **double counting** (spend consumes budget, and paying invoice consumes budget again).

## 4. Consequences

### 4.1 Positive

- **Clarity of intent:** users can answer both questions reliably:
  - “How did I do on my budgets this month?” (competence)
  - “Am I safe for upcoming due dates?” (cash impact)
- **Credit-card correctness:** card spending can be tracked without breaking cash projections.
- **Better guidance quality:** “cut this category” is based on competence spending pace, while “hard stop” is based on impact-date obligations.
- **Competitor-aligned budgeting:** credit card purchases behave like most budgeting apps (counts in the month you spent).
- **Extensible:** supports installments and mixed payment methods without forcing one mental model.

### 4.1 Negative (with mitigations)

- **Users may see “spent this month” but cash doesn’t move yet (credit card float), which can feel contradictory**

  - _Mitigation:_ explicitly label views:
    - **Budget view:** “Spending attributed to this month (purchase date)”
    - **Cashflow view / Safe-to-Spend:** “Money leaving checking by due dates”
  - _Mitigation:_ show a bridge explanation for card spend: “This purchase counts in your budget now, but will hit cash on invoice due date.”

- **Some users expect “statement month” budgeting**

  - _Mitigation:_ in card/invoice UI, show the bridge mapping:
    - **Purchase date → Assigned invoice → Due date**
  - _Mitigation:_ optionally add a future reporting view grouped by **invoice** for users who want “statement spend,” without changing budget semantics.

- **Implementation complexity (two timelines / two groupings)**

  - _Mitigation:_ keep a single underlying object graph:
    - Transactions and planned/predicted events produce two **read models**:
      - Budget read model keyed by competence month
      - Cashflow read model keyed by impact date
        This avoids duplicating business logic.

- **Risk of double counting if invoice payments are categorized**
  - _Mitigation:_ enforce a domain/UI rule:
    - Invoice payment transactions must be classified as **settlement** (or a special non-budget category excluded from analytics), never as category expenses.
