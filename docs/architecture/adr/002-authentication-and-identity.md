# ADR 002: Authentication & Identity

- **Status:** Accepted
- **Date:** 2026-01-09
- **Decision Owners:** Kaique Borges

## 1. Context

Prisma is a personal finance management application where **trust, privacy, and data protection** are non-negotiable. As a solo builder, implementing authentication end-to-end (credential storage, account recovery, MFA enrollment, abuse prevention, session hardening) creates disproportionate **security risk** and **maintenance overhead**, and is not a differentiator for Prisma’s core value (calm, correct, explainable finance workflows).

Decision drivers:

1. **Reduce security risk** by outsourcing high-risk identity primitives to a specialized provider
2. **Reduce maintenance overhead** to focus on Prisma’s differentiators
3. Keep an architecture that is **mobile-ready** without rewrites
4. Maintain clear internal boundaries: Prisma owns **authorization** and finance data isolation
5. Prefer a solution that is **cost-effective for early-stage/portfolio scale**, without sacrificing standards alignment

## 2. Decision

### 2.1 Use Clerk as the Authentication Provider (IdP)

Prisma will use **Clerk** to manage:

- User authentication UX (sign up, sign in, sign out)
- Email verification
- Password reset / account recovery
- Session management on the client (web), according to Clerk’s recommended patterns

Clerk is the authority for **proving identity**.

### 2.2 API Authentication Model: Bearer Token Verification

The Prisma API authenticates requests by verifying a **Clerk-issued token** presented as a bearer token.

Verification requirements:

- Verify token signature via **JWKS**
- Validate **issuer** and **audience**
- Validate token time claims (**exp**)
- Fail closed with consistent `401`/`403` behavior

Prisma does not accept identity assertions from the frontend without token verification.

### 2.3 Internal User Mapping: Prisma-owned Users Keyed by Clerk Subject

Prisma maintains an internal `users` table and maps it to Clerk using a stable external identifier (token **subject**).

- Prisma domain entities reference **Prisma `users.id`**, not Clerk identifiers directly
- This preserves data ownership and keeps a provider-migration path feasible

### 2.4 Authorization Remains Prisma’s Responsibility

Clerk answers “who is this user?”
Prisma answers “what can this user do?” and enforces:

- Ownership constraints on every read/write
- Domain invariants required for finance correctness and predictability

## 3. Environment & Domain Definition (Staging-first)

Staging:

- Web: `https://app.staging.prismafinance.app`
- API: `https://api.staging.prismafinance.app`

Production (mirror):

- Web: `https://app.prismafinance.app`
- API: `https://api.prismafinance.app`

## 4. Alternatives Considered

1. Prisma-owned authentication (passwords + sessions + recovery + MFA)
   - Rejected due to increased security risk and ongoing maintenance burden for a solo builder; not a Prisma differentiator.

2. AWS Cognito
   - Rejected due to higher integration/configuration complexity and slower iteration speed for a solo Next.js-focused workflow.

3. Auth0
   - Considered a strong standards-aligned option with broad adoption.
   - Rejected in favor of Clerk due to a better fit for Prisma’s constraints: **faster Next.js-centric integration** and a belief that Clerk is **more cost-effective at Prisma’s expected early-stage/portfolio scale** (while still supporting OIDC-style patterns and future mobile needs).

4. API validates no IdP tokens (custom tokens only)
   - Rejected because it recreates the security and operational complexity Prisma explicitly wants to avoid owning (token issuance, refresh rotation, key management, incident response for signing keys).

## 5. Consequences

Positive:

- Reduced risk of common auth/security mistakes compared to custom implementation
- Faster iteration on product-differentiating areas (finance correctness, explainability, calm UX)
- A path to mobile clients via standard IdP token patterns
- Cleaner portfolio narrative: pragmatic vendor use for non-differentiating, high-risk infrastructure
- Potentially lower total cost for early-stage usage by choosing Clerk over heavier enterprise-oriented setups

Negative:

- Vendor dependency on Clerk availability and long-term pricing evolution
- Need disciplined environment separation (staging vs prod Clerk configs; correct issuer/audience validation)
- The API must implement correct token verification and failure behavior (smaller scope than full auth, but still critical)

## 6. Notes (Non-normative)

- Cache JWKS keys and handle rotation safely
- Never log raw `Authorization` headers or tokens
- Treat auth failures as expected outcomes (clean `401`/`403`), not exceptions that pollute error tracking
- Plan for future MFA support via Clerk’s built-in flows
