# Prisma — North Star Card

- **Purpose:** Keep Prisma focused on **reducing financial anxiety** and **increasing clarity** for Brazilian users, without triggering “big planning upfront.”
- **How to use:** Any built slice/story should clearly advance **at least one** outcome below.

## North Star Outcomes

### 1) Obligations are out of my head and into Prisma

- **Primary persona:** Juliana
- **Outcome:** Users trust Prisma to hold their recurring obligations and show what’s coming, so they’re not mentally tracking bills.
- **Evidence (signals):**
  - User can confidently answer: **“What’s due next?”** by checking Prisma.
  - Upcoming obligations becomes a **frequent, calming check-in** (not a stressful audit).
  - Users rely less on memory/notes for due dates.

### 2) I can decide what to do today without fear

- **Primary persona:** Juliana (also valuable to Alex)
- **Outcome:** Prisma provides a **conservative, understandable** daily guidance signal so spending decisions feel safer.
- **Evidence (signals):**
  - Users check Prisma before discretionary spending.
  - The guidance number can be explained in **one short paragraph**.
  - Prisma degrades gracefully when data is missing (clear “what I know / what to add”).

### 3) Capturing reality is sustainable (manual-first actually works)

- **Primary persona:** Both (Juliana is the constraint)
- **Outcome:** Logging income/expenses is fast enough to sustain, so Prisma stays reasonably current without bank integrations.
- **Evidence (signals):**
  - A transaction can be logged in **~30–60 seconds** on mobile (dogfood test).
  - Users don’t avoid input due to complexity.
  - Mistakes are easy to correct (edits/deletes feel safe).

### 4) I understand where my money went this month (without a spreadsheet)

- **Primary persona:** Alex (also helps Juliana)
- **Outcome:** Prisma provides a monthly view that answers **“where did my money go?”** with progressive detail.
- **Evidence (signals):**
  - User can describe the month: **income, essential outflows, discretionary, net**.
  - User finds at least **1–2 actionable patterns** they didn’t realize.
  - The month view creates **closure and clarity**, not confusion.

### 5) Prisma behaves predictably and feels safe (trust is non-negotiable)

- **Primary persona:** Both
- **Outcome:** Users trust Prisma as a source of truth because totals reconcile, edits don’t feel like “magic,” and nothing is silently lost.
- **Evidence (signals):**
  - Users can trace “why is this number X?” via simple breakdowns.
  - Edits/deletes don’t create confusing side effects.
  - Fewer moments of “I don’t trust this app.”

### 6) The product tone reduces shame and cognitive load

- **Primary persona:** Juliana
- **Outcome:** Prisma feels like a calm guide—supportive, low cognitive load, non-judgmental—so users keep engaging even when money is tight.
- **Evidence (signals):**
  - Messaging is neutral and actionable (no punitive tone).
  - Users don’t churn after a “bad week/month.”
  - Setup and daily flows avoid overwhelming choice density.

## Guardrails (non-negotiables)

- **Manual-first must be viable:** no outcome depends on bank syncing.
- **Explainability over sophistication:** any guidance number must be explainable simply.
- **Juliana sets the UX bar:** if it’s too complex for her, it’s not Prisma yet.
- **Trust over breadth:** fewer features with high reliability beats many with low confidence.

## Day-to-day decision filter

Before starting a slice, we must answer:

1. **Which outcome(s) does this move?**
2. **What is the smallest shippable increment that proves progress?**
3. **What evidence will I accept this week that it worked?** (even qualitative)
4. **Does this increase cognitive load or reduce it?**
5. **Does this risk trust/data integrity?** If yes, address that first.

## Planning fidelity rules (anti-overwhelm)

- Keep most backlog items as **headlines** (no acceptance criteria yet).
- Only detail **the next slice** (typically 1–4 user stories) into “Ready” form.
- WIP limits:
  - **Max 3 Ready items**
  - **Max 10 headline stories per epic** before shipping something

## What this card is (and isn’t)

- **Is:** a stable direction for the next weeks
- **Is not:** a feature list, a roadmap, or a commitment to build everything
