# ADR-007 — Cash Accounts in MVP (Spendable Cash Scope)

## 1. Context

Prisma’s “Safe to Spend Today” depends on a clear definition of **what counts as available money**. In a manual-first MVP, expanding the cash pool to include:

- savings accounts,
- investment accounts,
- wallet cash,
- or other non-checking stores of value

creates ambiguity and lowers reliability because:

- transfers are not automatically detected (no bank integrations),
- users may forget to enter movements,
- “available” depends on intent (savings may be earmarked),
- liquidity varies (investments may not be instantly accessible).

For Prisma’s core promise—**reduce anxiety via conservative, trustworthy guidance**—it’s better to start with a strict definition of spendable cash.

This ADR must align with the planning engine decisions:

- Safe-to-spend uses a timing-aware cash projection (**CashHeadroom**) across the timeline to EOM.
- Hard stops protect obligations due (bills, invoice due events).
- Transfers are assumed net-zero in aggregate for MVP (unless modeled explicitly).

## 2. Decision

1. Prisma models **checking accounts only** as spendable cash sources in MVP.
2. **Non-goal (MVP):** savings, investments, and wallet cash are excluded from Safe-to-Spend calculations.
3. Safe-to-spend cash projections (**CashHeadroom**) operate over the aggregate balance of all checking accounts (a single “cash pool”) unless/until per-account constraints are added.
4. Users may still track other accounts for informational purposes later, but they do **not** affect the MVP guidance engine.

## 3. Alternatives considered

1. **Include savings accounts in spendable cash**

   - Pro: higher “available” value; might match some users’ intuitive net cash.
   - Con: breaks the conservative model; savings is often protected/earmarked; raises ambiguity.

2. **Include investments**

   - Pro: closer to net worth.
   - Con: liquidity and valuation complexity; not aligned with Safe-to-Spend.

3. **Include wallet cash**

   - Pro: more complete.
   - Con: manual tracking burden; high likelihood of drift; reduces trust in daily guidance.

4. **User-defined “which accounts are spendable”**
   - Pro: flexible.
   - Con: increases setup complexity; misconfiguration can produce unsafe guidance.

## 4. Consequences

### 4.1 Positive

- **Reliable definition of “available money”:** fewer edge cases and less user confusion.
- **Conservative guidance:** safer defaults reduce the chance of Prisma telling users they can spend money they can’t actually access.
- **Simpler onboarding:** users only need to set up checking accounts to get value from safe-to-spend.
- **Lower data-entry burden:** fewer account types to keep reconciled manually.

### 4.1 Negative (with mitigations)

- **Users with most money in savings may see artificially low safe-to-spend**

  - _Mitigation:_ clear copy: “Safe-to-spend is based on your checking balance. Move money to checking to make it spendable.”
  - _Mitigation:_ provide an explicit “Transfer from savings” flow (manual entry) that increases checking cash and is reflected immediately.

- **Doesn’t reflect net worth or long-term health**

  - _Mitigation:_ position this as an MVP scope choice and optionally include a separate “Net Worth” page later that does not influence safe-to-spend.

- **Aggregate pool hides per-account constraints**
  - _Mitigation:_ be explicit in scope: safe-to-spend assumes checking accounts are a shared pool. If users have strict per-account bill routing, they may need to track that manually until a future per-account projection feature exists.
