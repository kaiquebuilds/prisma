# ADR-010 — Data Freshness Gate for Guidance (Balance Snapshot Recency)

## 1. Context

Prisma’s Safe-to-Spend is only as accurate as the **current cash balance** and the user’s recent entries. In a manual-first MVP, stale balances create a high-risk failure mode:

- Prisma may tell users they can safely spend money that was already spent but not recorded.
- Or Prisma may block spending incorrectly, causing unnecessary stress.

Because Prisma’s core value proposition is **trustworthy guidance that reduces anxiety**, it must avoid presenting a precise daily number when the underlying data is likely out of date.

This ADR relies on and complements:

- ADR-009 (balance snapshots are source of truth + reconciliation entries)
- the consolidated planning engine ADR (freshness gate can force conservative safe-to-spend behavior)

## 2. Decision

1. “Safe to Spend Today” is considered **reliable** only if **checking account balance snapshots** have been updated within **3 days**.
2. If balances are older than 3 days, Prisma must treat guidance as **unreliable** and apply a conservative behavior in the safe-to-spend surface (e.g., show `R$ 0` or show an explicit “needs update” blocking state, depending on UX choice).
3. Freshness is evaluated in the **user’s configured timezone**, based on the effective timestamp of the latest snapshot for the cash pool.

> Scope note: since MVP safe-to-spend is based on checking accounts only (ADR-008), this freshness gate applies to those accounts.

## 3. Alternatives considered

1. **No freshness gate**

   - Rejected: leads to unsafe guidance and breaks trust.

2. **Shorter window (1 day)**

   - Pro: higher correctness.
   - Con: too strict for many users; increases churn risk and friction.

3. **Longer window (7 days)**

   - Pro: lower friction.
   - Con: too permissive; a week of untracked spend can be substantial.

4. **Per-user adaptive window**
   - Deferred: could be powerful (based on drift frequency), but adds complexity and decision ambiguity for MVP.

## 4. Consequences

### 4.1 Positive

- **Prevents dangerous confidence:** safe-to-spend won’t pretend to be accurate when it isn’t.
- **Supports habit formation:** nudges users toward regular check-ins.
- **Protects Prisma’s brand trust:** better to be conservative than wrong.

### 4.1 Negative (with mitigations)

- **Users may be frustrated by frequent “blocked” guidance**

  - _Mitigation:_ make the balance update flow extremely lightweight (single number entry per account, quick reconcile).
  - _Mitigation:_ provide a clear explanation: “Your balance is older than 3 days, so Prisma can’t safely calculate today’s number.”

- **Users with stable routines might feel the gate is unnecessary**

  - _Mitigation:_ allow a future “confidence mode” that still shows the number but with a strong warning; keep MVP strict to protect trust.

- **Edge cases with travel/timezone changes**

  - _Mitigation:_ freshness should use the **configured user timezone** (ADR-031) and not fluctuate with device timezone changes unless the user updates their settings.

- **Multiple checking accounts: one stale account may block the whole pool**
  - _Mitigation:_ define rule explicitly:
    - either require **all** checking accounts updated within 3 days, or
    - require a “primary cash account” updated (future).
      MVP recommendation: require **all included checking accounts**, because pooled cash requires complete recency to be safe.
