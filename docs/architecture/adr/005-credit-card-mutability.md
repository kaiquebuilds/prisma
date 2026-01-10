# ADR-005 — Card Configuration Mutability (Closing/Due Day Changes)

## 1. Context

Prisma generates credit card invoices and assigns purchases to statement cycles using **card-level configuration**:

- `closingDay`
- `dueDay`

In the real world, users may:

- correct wrong setup (they entered the wrong days),
- have issuer changes (bank changes cycle),
- or intentionally adjust configuration after learning.

Because Prisma is manual-first, historical accuracy and trust are critical:

- If a user changes cycle configuration, Prisma must not silently reshuffle prior purchases across invoices.
- Recomputing past invoices can cause:
  - “moving targets” in historical views,
  - broken links between purchases and invoices,
  - confusion (“why did last month change?”),
  - and projection discontinuities.

This ADR must align with the broader “series editing forward” pattern already adopted for bills: **changes apply forward, not retroactively**.

## 2. Decision

1. Changes to card cycle configuration (`closingDay`, `dueDay`) apply **only to future invoices**.
2. **Past invoices remain immutable**:
   - their `closingDate`, `dueDate`, and the set of assigned purchases are not recomputed due to later config edits.
3. Prisma should define a clear cutoff point for “future invoices,” recommended as:
   - invoices whose closing date is **on or after** an “effective from” date (e.g., the date the change is saved), or
   - invoices not yet generated at the time of change.

> MVP-friendly approach: store `effectiveFrom` on the new config version, and use versioned configuration for invoice generation going forward.

## 3. Alternatives considered

1. **Recompute all invoices whenever config changes**

   - Rejected: breaks auditability and user trust; risks cascaded bugs.

2. **Allow user to choose “apply to past invoices”**

   - Deferred: can be powerful for “I set it up wrong,” but risky and complex.
   - If added later, it should be an explicit migration flow with previews.

3. **Disallow config edits after first invoice**
   - Rejected: too restrictive; doesn’t match real user needs.

## 4. Consequences

### 4.1 Positive

- **Auditability and trust:** historical statements don’t change unexpectedly.
- **Stability:** avoids bugs from retroactive reassignment of purchases/installments.
- **Consistency with other domains:** matches your “edit occurrence vs series going forward” philosophy.
- **Predictable projections:** future obligations shift, past history stays consistent.

### 4.1 Negative (with mitigations)

- **If the user originally configured the card incorrectly, history stays “wrong”**

  - _Mitigation:_ provide a manual override mechanism (already in ADR-002) at the purchase/invoice level so users can correct specific misassignments.
  - _Mitigation (future):_ offer an explicit “rebuild history” wizard that:
    - previews invoice changes,
    - requires confirmation,
    - and is reversible (versioned snapshot).

- **Edge-case confusion around the cutoff (“is next invoice ‘future’?”)**

  - _Mitigation:_ explicitly display in settings:
    - “This change will apply starting with invoice that closes on: [date]”
    - show a preview of the next closing/due dates under the new config.

- **Multiple configuration changes over time increases complexity**
  - _Mitigation:_ implement card config as versioned records with `effectiveFrom`, and always show the current effective config to the user.
