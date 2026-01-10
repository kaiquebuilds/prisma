# Environments & Deployment Architecture

This document defines Prisma’s runtime environments (local, preview, staging, production), including **domains**, **configuration boundaries**, and **operational policies**. It exists to make the system **reproducible**, **safe to operate**, and easy for contributors/reviewers to understand.

This is an environment/runbook document. It complements ADRs (which capture decisions and rationale).

## Environments Overview

### Local (developer machine)

Goal: fast iteration with production-like constraints where practical.

- Runs: `apps/web` + `apps/api` + Postgres via Docker Compose
- Uses: local env files and local secrets (never committed)
- Should support: end-to-end flows for core product development

### Preview (Vercel preview deployments)

Goal: review UI and UX changes quickly on PRs.

- Runs: `apps/web` only (UI-only policy)
- Not guaranteed: authenticated E2E behavior against staging API
- Intended use: layout, copy, navigation, responsive behavior, basic rendering

### Staging (production-like integration)

Goal: validate full-stack behavior in a real environment before production.

- Runs: `apps/web` on Vercel + `apps/api` on AWS + RDS Postgres
- Protected by an outer gate (Basic Auth) to reduce exposure and noise
- Intended use: E2E testing, release candidates, operational verification

### Production (public)

Goal: the real environment.

- Runs: `apps/web` on Vercel + `apps/api` on AWS + RDS Postgres
- Public internet-facing (no staging gate)
- Intended use: real usage, reliability, monitoring, and incident response

## Domain & Routing Policy

### Root domain

- `prismafinance.app`

### Canonical domains

#### Staging

- Web: `https://app.staging.prismafinance.app`
- API: `https://api.staging.prismafinance.app`

#### Production

- Web: `https://app.prismafinance.app`
- API: `https://api.prismafinance.app`

### Preview policy (UI-only)

- Preview deployments use Vercel-provided URLs (e.g., `*.vercel.app`)
- Previews are not expected to support full authenticated E2E flows against staging API
- Staging is the canonical environment for end-to-end auth + API integration testing

## Configuration & Secrets Boundaries

### Core rules

1. Secrets are never committed to the repository.
2. Staging and production secrets are strictly separated.
3. The API must validate identity tokens using environment-specific configuration (no cross-env trust).

### Where configuration lives

- Local: `.env` files (developer machine only; gitignored)
- Web (staging/prod): Vercel environment variables
- API (staging/prod): ECS task definition environment variables and/or AWS secrets
- CI: GitHub Actions secrets (only for CI/CD workflows)

### Naming conventions (recommended)

- Use consistent prefixes by app:
  - `WEB_*` for `apps/web`
  - `API_*` for `apps/api`
- Use environment-specific values, not environment-specific variable names.

## Identity Provider Configuration (Clerk)

### Separation strategy

- Use separate Clerk environment configuration for:
  - Staging
  - Production

### Trust rules

- Staging API accepts only staging identity tokens.
- Production API accepts only production identity tokens.

### Operational notes

- Any changes to identity provider configuration must be treated as production-impacting.
- Token verification errors should be observable (metrics/logs) but should not leak sensitive token data.

## Staging Access Policy (Outer Gate)

### Goal

Reduce exposure, noise, and unintended traffic to staging while Prisma is under active development.

### Policy

- Staging web and staging API are protected by **Basic Auth at the edge**.

### Critical browser constraint (preflight)

- Browser clients may send `OPTIONS` requests (CORS preflight) without auth headers.
- If the Basic Auth gate blocks `OPTIONS`, browser API calls will fail due to CORS errors.

Therefore:

- `OPTIONS /*` to the staging API must succeed in a way that preserves CORS behavior (gate must not break preflight).

### Logging safety

- Never log Basic Auth credentials or raw Authorization headers.
- If request logging exists, it must redact sensitive headers.

## API CORS Policy

### Staging

Allow only the staging web origin:

- Allowed origin: `https://app.staging.prismafinance.app` (exact match)
- Allowed methods: `GET,POST,PUT,PATCH,DELETE,OPTIONS`
- Allowed headers: include `Authorization`, `Content-Type`
- `Vary: Origin` must be set

### Production

Allow only the production web origin:

- Allowed origin: `https://app.prismafinance.app` (exact match)
- Allowed methods/headers: same as staging

### Notes

- Do not use wildcard origins on credentialed or authenticated APIs.
- CORS changes are security changes and must be reviewed carefully.

## Data & Persistence Policy

### Database instances

- Local: Postgres container (Docker Compose)
- Staging: dedicated RDS Postgres instance (not shared with prod)
- Production: dedicated RDS Postgres instance

### Migrations

- Migrations must be applied in staging before production.
- Schema changes should be backwards-compatible when possible (to reduce deploy coupling).

### Seeding

- Local seeding is allowed to speed development.
- Staging seeding should be minimal and deterministic (optional).
- Production seeding should be avoided unless part of a controlled release process.

## Observability by Environment

### Local

- Developer console logs
- Optional local error tracking disabled by default

### Staging

- Must support debugging release candidates:
  - API logs available (CloudWatch)
  - Web and API error tracking enabled (Sentry)
- Noise should be minimized (hence staging gate)

### Production

- Must support incident response:
  - API logs and metrics available
  - Error tracking enabled
  - Alerts configured for availability/latency/error rate where feasible

## Release Flow (Simplified)

1. Develop locally (local environment).
2. Use Vercel previews for UI review (preview environment).
3. Deploy to staging and run E2E checks (staging environment).
4. Promote to production after staging validation (production environment).

## Non-Goals

- This document does not define detailed infrastructure provisioning steps (DNS setup, Terraform, etc.).
- This document does not define product requirements or security/auth decision rationale (see ADRs for that).
