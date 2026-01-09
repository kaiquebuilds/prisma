# Prisma Development Playbook

A concise, reliable guide to how Prisma is planned and built without big upfront planning.

## 1) Core goals of this process

### 1.1 What this process optimizes for

- Tight feedback loops (ship → use → learn → adjust)
- Small shippable increments that reduce risk
- Prisma-specific focus: ship features that reduce anxiety and increase clarity first

### 1.2 What this process avoids

- Big design upfront across the whole app
- Exhaustive user stories and acceptance criteria for the entire product
- Layer-based milestones (DB first, then API, then UI) instead of user value

## 2) Key vocabulary (to remove confusion)

### 2.1 Epic

- What it is: a large capability/theme grouping many stories (e.g., Bills & Obligations).
- Purpose: organize product scope and communicate roadmap areas.
- Rule: epics stay lightweight; they are not full specs.

### 2.2 User story

- What it is: a unit of requirement expressing value from a persona’s perspective.
- Template: As [persona], I want [capability], so that [benefit].
- Purpose: define what and why.

### 2.3 Slice (vertical slice / increment / user flow)

- What it is: a unit of delivery: the smallest end-to-end, shippable outcome.
- Purpose: define what will be working in the product after a cycle.
- Note: a slice often includes 1–4 user stories.

### 2.4 Relationship (mental model)

- Epic = the map (area)
- Slices = the steps (how value ships)
- User stories = requirement units inside slices

## 3) Planning strategy: progressive elaboration

### 3.1 North Star Outcomes (stable)

- A small set of outcomes that anchor Prisma’s purpose.
- Examples:
  - I know what’s coming next (Upcoming Bills)
  - I know what I can spend safely (Safe to Spend)
  - I can capture reality quickly (fast manual entry)

### 3.2 Story map headlines (broad, low detail)

- One-liner stories (no acceptance criteria).
- Purpose: coverage without commitment.

### 3.3 Just-in-time Ready stories (high detail)

- Only the next 1–3 stories scheduled for implementation get acceptance criteria + edge cases.

Rule: the backlog can be incomplete. Only the next increment must be complete.

## 4) What “planned ahead” means

### 4.1 Backlog fidelity states

Each backlog item lives in one of these states:

1. Idea (1 sentence)
2. Story (persona + goal + benefit)
3. Ready (acceptance criteria + key edge cases + Done definition)

### 4.2 WIP limits (anti-overwhelm guardrails)

- Max 3 Ready items at a time
- Max 10 Story items per epic before pausing and shipping

## 5) Execution workflow: dual-track

### 5.1 Discovery (small, timeboxed)

Purpose: clarify the next slice enough to build it confidently.

Outputs:

- Slice goal (user outcome)
- 1–4 user stories included
- Minimal acceptance criteria
- Biggest risk/unknown (if any)

### 5.2 Delivery (main)

Purpose: build, test, ship, and learn.

Each slice is built end-to-end:

- UI + empty/loading/error states
- Domain rules/calculations
- Persistence/data integrity
- Minimal observability
- Release note

## 6) Cadence

### 6.1 Weekly cadence

- Weekly goal: ship 1 meaningful user outcome (1 slice).
- End-of-week demo: record a short demo (1–3 minutes) and write a short changelog entry.

### 6.2 Planning timeboxes

- Monthly/quarterly (30–60 min): refresh outcomes + headline story map
- Weekly (20–40 min): select next slice + define success
- Per story (10–20 min): write acceptance criteria only when implementation is next

## 7) Acceptance criteria principles

Acceptance criteria should reinforce:

- Clarity
- Trust
- Reduced anxiety
- Explainability for numbers/decisions

## 8) Definition of Done

A slice is Done only when:

1. All acceptance criteria are met

2. Necessary tests are written and pass

3. Our [quality gates](../product/quality-gates.md) are satisfied:

   1. Calm tone (no shame/blame)
   2. Empty / Loading / Error states
   3. Confirm + feedback + undo (risky actions)
   4. Explainable numbers + assumptions (if any)
   5. Integrity: edits/deletes keep totals consistent
   6. Mobile-ready (tap targets + readability)

4. Correctness

   - Key calculations and updates behave consistently.

5. UX completeness

   - Includes empty, loading, and error states.

6. Data integrity

   - Edits/deletes are safe and don’t silently corrupt balances/obligations.

7. Observability

   - Basic event logging exists for key actions (e.g., bill_created, transaction_added).

8. Security baseline

   - Least privilege, safe input handling, no obvious sensitive data leakage.

9. Documentation is updated

   - Changelog entry created with what was shipped.
   - Relevant docs (user help, architecture decisions) are updated.

10. Deployed to production
    - Code is live and available to users.

## 9) Prioritization

### 9.1 Priority ladder

1. P0: Anxiety reducers

   - Obligations visibility, Upcoming Bills, closure (mark paid), Safe-to-Spend basics

2. P1: Control systems

   - Categorization, budgets, gentle warnings, explainability

3. P2: Optimization

   - Insights, what-if projections, advanced suggestions

### 9.2 Default path must be excellent

Ship the smallest version of the most calming flows first, then deepen.

## 10) Spikes

### 10.1 What a spike is

A short research/prototype task whose output is:

- A decision
- A constraint list
- Or a tiny prototype

### 10.2 When to spike

Spike when uncertainty is high around:

- Recurring bill modeling
- Date/due rules
- Balance integrity with edits/deletes
- Explainable Safe-to-Spend calculations

### 10.3 Spike rule

A spike is timeboxed and must produce a concrete output, otherwise it is cut or reframed.

## 11) Quick decision rules (when uncertain)

1. Is planning getting too detailed?

   - If acceptance criteria are being written for items not scheduled next, planning is too deep.

2. Should this be an epic or a slice?

   - Product area = epic.
   - What ships this cycle = slice.

3. Is this a story or a slice?

   - Story = requirement statement.
   - Slice = shippable increment that may bundle multiple stories.

4. What should be detailed right now?
   - Only the next slice and its 1–3 Ready stories.

## 12) Artifacts to produce

- PRD-lite per epic (1 page max): problem, outcomes, non-goals
- ADR per major decision: why modeling/calculations were designed a certain way
- Changelog + demo clips: proof of consistent shipping
- Friction log: where users hesitated/confused (Prisma is anxiety-driven)
