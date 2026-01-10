# ADR-002 — Credit Card Statement Cycle & Invoice Assignment

## 1. Context

Prisma needs a deterministic way to:

1. **Generate credit card invoices** from a user’s manual purchase entries (and installments), and
2. **Assign each purchase** to the correct invoice cycle using only **card-level configuration**.

In Brazil (and generally), cards are defined by two key dates:

- **Closing day** (statement “cutoff” day-of-month)
- **Due day** (payment due day-of-month)

Because Prisma is manual-first, the system must be:

- **Predictable** (users can reason about why a purchase landed in a given invoice)
- **Edge-case safe** (months with fewer days, cards configured with 29–31, timezone boundaries)
- **Overridable** (when real-world bank behavior differs from the model or the user entered dates late)

This ADR must also align with Prisma’s planning engine rules:

- Credit card invoices are **obligations** (not skippable).
- Invoices become part of the **FinancialEvent** timeline as due-date obligations.

## 2. Decision

### 2.1 Card configuration

Each card has:

- `closingDay` (1–31)
- `dueDay` (1–31)
- `timezone` = user configured timezone (from the global timezone ADR)

### 2.2 Invoice generation model

For each month, Prisma generates an **Invoice** (and an associated **InvoiceDue FinancialEvent**) with:

- `closingDate` = the calendar date in that month on `closingDay`
  - **If `closingDay` is invalid for the month**, then `closingDate = last day of month` (same rule style you already chose for due day; recommend symmetry).
- `dueDate` = the calendar date in the due month on `dueDay`
  - **Rule B (kept):** if `dueDay` is invalid for that month, `dueDate = last day of month`.

> Note: whether dueDate is in the **same month** or **next month** depends on how you model cycles. For MVP, keep it deterministic by defining “invoice month” as the month of the closing date, and “due month” as the month that contains the due date implied by card config (often next month). This should be explicitly stated in the implementation spec/UI.

### 2.3 Purchase → invoice assignment (cycle boundary rule)

- **Rule A (kept, made explicit):** purchases on the **closing date** belong to the **current** invoice.
- Equivalent boundary definition (more formal, less ambiguous):
  - An invoice covers the interval **(previousClosingDate, closingDate]** in the user timezone.
  - So:
    - If `purchaseDate &lt;= closingDate` and `purchaseDate > previousClosingDate` → current invoice
    - Else → next/other invoice as determined by the chain of closing dates

This makes it crystal clear that the closing date is an **inclusive** upper bound.

### 2.4 Manual override

Prisma allows a manual override at the purchase level:

- `manualInvoiceId` (or “Assigned invoice override”)
- When set, the override wins over computed cycle assignment.

This is used when:

- A bank issuer applies different rules for the closing date boundary, or
- The user entered the purchase late and wants to reflect their real statement.

## 3. Alternatives considered

1. **Closing date belongs to the next invoice (i.e., [previousClosingDate, closingDate) with exclusive closing date)**

   - Pro: matches some issuers’ behavior (varies).
   - Con: conflicts with your current draft; also creates “why did it jump?” confusion when the purchase is on the closing date.

2. **No manual override**

   - Pro: simpler data model.
   - Con: breaks trust when the bank differs; users will consider Prisma “wrong” with no fix.

3. **Infer statement cycles from user-entered invoice PDFs / bank data**

   - Out of scope for MVP (manual-first; no integrations).

4. **Hardcode dueDate = closingDate + N days**
   - Pro: simpler.
   - Con: incorrect across cards; users know their due day, not “+10 days”.

## 4. Consequences

### 4.1 Positive

- **Deterministic assignment:** users can predict invoice membership from card config.
- **Low setup cost:** only closing day and due day required.
- **Edge-case handling is explicit:** months lacking the due day won’t break generation.
- **Trust-preserving escape hatch:** manual override avoids “Prisma is wrong” dead-ends.

### 4.1 Negative (with mitigations)

- **Issuer variability risk:** some banks may treat closing-day purchases differently.

  - _Mitigation:_ keep the manual override, and show the computed **cycle range** in the UI (e.g., “Covers Jan 11 → Feb 10”) so users can spot mismatches.

- **Ambiguity about “invoice month” vs “due month”:** without an explicit rule, users may not understand which invoice you’re talking about.

  - _Mitigation:_ define invoice identity as the **closing month** (e.g., “Invoice Feb/2026 (closes Feb 10)”) and always display **closing date + due date** together.

- **Month-end normalization can surprise users (e.g., closingDay=31):**
  - _Mitigation:_ apply the **same normalization rule** for closing day as for due day (invalid day → last day), and surface the resolved dates in settings preview (“Next closing: Feb 28”).

---

If you paste ADR-003 next, I’ll review it the same way and call out any conflicts with the consolidated Planning/Safe-to-Spend ADR (especially around invoice obligations vs predicted items).
