# ADR-009 — Balance Snapshots as Source of Truth + Reconciliation Entries

## 1. Context

Prisma is manual-first in MVP, meaning it cannot rely on bank integrations to keep account balances continuously accurate. Over time, users will inevitably have drift between:

- the **derived balance** computed from starting balance + posted transactions, and
- the **real-world balance** they see in their bank app.

This drift can be caused by:

- missed entries (cash withdrawal, small debit, Pix, fees),
- incorrect amounts/dates,
- delayed posting,
- or user entering transactions late.

Because Safe-to-Spend relies on cash correctness, Prisma needs a way to:

- re-anchor balances to reality,
- preserve an audit trail (no silent mutation),
- and keep the system explainable and trustworthy.

This must also align with your earlier decision:

- reconciliation entries are labeled **“Balance correction”** and excluded from budgets/category analytics.

## 2. Decision

1. Users provide **balance snapshots** per checking account.

   - A snapshot is the user-declared balance at a specific timestamp/date (in the user’s configured timezone).

2. Balance snapshots are treated as the **source of truth** for cash position at that time.

3. When a snapshot differs from Prisma’s **derived balance** at the same timestamp:

   - Prisma records a **reconciliation entry** (“Balance correction”) explaining the delta.
   - The reconciliation entry is a posted ledger entry that adjusts the account balance by the delta.

4. Reconciliation entries:
   - are **excluded from budgets** and category analytics,
   - should be visible in an audit trail,
   - and should not be presented as “spending.”

## 3. Alternatives considered

1. **Mutate the starting balance or silently overwrite derived balance**

   - Rejected: destroys auditability and makes drift inexplicable.

2. **Force the user to find and enter missing transactions**

   - Rejected for MVP: too much friction; doesn’t fit “reduce anxiety.”

3. **Allow reconciliation but categorize it as an expense/income**

   - Rejected: pollutes budgets and guidance; reconciliation is corrective bookkeeping, not behavior.

4. **Use only derived balances (no snapshots)**
   - Rejected: drift would accumulate and Safe-to-Spend would become untrustworthy.

## 4. Consequences

### 4.1 Positive

- **Correctness anchor:** users can quickly re-align Prisma with their bank.
- **Audit trail:** the delta is explained by an explicit entry rather than silent changes.
- **Improves Safe-to-Spend reliability:** projections start from a trustworthy cash base.
- **Reduced anxiety:** users don’t need to hunt every missing transaction to regain confidence.

### 4.1 Negative (with mitigations)

- **Reconciliation entries can hide underlying tracking issues**

  - _Mitigation:_ show a lightweight “drift trend” indicator (“you’ve needed 3 corrections this month”) and optional prompts to improve capture (without shaming).

- **Users may treat reconciliation as “income” and spend it**

  - _Mitigation:_ label as **Balance correction** and exclude from “earned/spent” summaries; optionally show it in a separate “Adjustments” section.

- **Snapshot timestamps and timezone issues can cause confusing deltas**

  - _Mitigation:_ standardize snapshot entry as “end of day” or “right now” in the user’s timezone, and display the effective timestamp clearly.

- **Potential abuse: user can inflate balance to inflate safe-to-spend**
  - _Mitigation:_ make the snapshot flow explicit (“Enter the balance shown in your bank”), and if desired later, add gentle anomaly detection (“This is `R$ X` higher than yesterday—are you sure?”) without blocking.
