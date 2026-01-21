# Environments & Deployment Architecture

This document defines Prisma’s runtime environments (**local, preview, staging, production**), including **domains**, **configuration boundaries**, and **operational policies**. It exists to make the system **reproducible**, **safe to operate**, and easy for contributors/reviewers to understand.

This is an environment/runbook document. It complements ADRs (which capture decisions and rationale).

# Environments Overview

## Local (developer machine)

Goal: fast iteration with production-like constraints where practical.

- Runs: `apps/web` + `apps/api` + Postgres locally (Docker Compose)
- Uses: local env files and local secrets (never committed)
- Should support: end-to-end flows for core product development

## Preview (Vercel Preview deployments)

Goal: review UI and UX changes quickly on PRs.

- Runs: `apps/web` only (**UI-only policy**)
- Not guaranteed: authenticated E2E behavior against staging API
- Intended use: layout, copy, navigation, responsive behavior, basic rendering

## Staging (production-like integration)

Goal: validate full-stack behavior in a real environment before production.

- Runs:
  - `apps/web` on **Vercel**
  - `apps/api` on **Render**
  - Postgres on **Neon**
- Intended use: E2E testing, release candidates, operational verification

## Production (public)

Goal: the real environment.

- Runs:
  - `apps/web` on **Vercel**
  - `apps/api` on **Render**
  - Postgres on **Neon**
- Intended use: real usage, reliability, monitoring, and incident response

# Domain & Routing Policy

## Root Domain

- `prismafinance.app`

## Canonical Domains

### Staging

- Web: `https://app-staging.prismafinance.app` (Vercel)
- API: `https://api-staging.prismafinance.app` (Render)

### Production

- Web: `https://app.prismafinance.app` (Vercel)
- API: `https://api.prismafinance.app` (Render)

## Preview Policy (UI-only)

- Preview deployments use Vercel-provided URLs (e.g., `*.vercel.app`)
- Previews are not expected to support full authenticated E2E flows against staging API
- Staging is the canonical environment for end-to-end auth + API integration testing

# Configuration & Secrets Boundaries

## Core Rules

1. Secrets are never committed to the repository.
2. Staging and production secrets are strictly separated.
3. The API must validate identity tokens using environment-specific configuration (**no cross-env trust**).

## Where Configuration Lives

- Local:
  - `.env` files (developer machine only; gitignored)
- Web (staging/prod):
  - **Vercel** environment variables
- API (staging/prod):
  - **Render** environment variables / secrets
- Database (staging/prod):
  - **Neon** connection strings (stored as secrets in Render; not committed)
- CI:
  - GitHub Actions secrets (only for CI/CD workflows)

# Identity Provider Configuration (Clerk)

## Separation Strategy

- Use separate Clerk environment configuration for:
  - Staging
  - Production

## Trust Rules

- Staging API accepts only staging identity tokens.
- Production API accepts only production identity tokens.

## Operational Notes

- Any changes to identity provider configuration must be treated as production-impacting.
- Token verification errors should be observable (metrics/logs) but should not leak sensitive token data.

# API CORS Policy

## Staging

Allow only the staging web origin:

- Allowed origin: `https://app-staging.prismafinance.app` (exact match)
- Allowed methods: `GET,POST,PUT,PATCH,DELETE,OPTIONS`
- Allowed headers: include `Authorization`, `Content-Type`
- `Vary: Origin` must be set

## Production

Allow only the production web origin:

- Allowed origin: `https://app.prismafinance.app` (exact match)
- Allowed methods/headers: same as staging

## Notes

- Do not use wildcard origins on credentialed or authenticated APIs.
- CORS changes are security changes and must be reviewed carefully.

# Data & Persistence Policy

## Database Instances

- Local: Postgres container (Docker Compose)
- Staging: **Neon Postgres** (dedicated staging database/project; not shared with prod)
- Production: **Neon Postgres** (dedicated production database/project; not shared with staging)

## Migrations

- Migrations must be applied in staging before production.
- Schema changes should be backwards-compatible when possible (to reduce deploy coupling).

## Seeding

- Local seeding is allowed to speed development.
- Staging seeding should be minimal and deterministic (optional).
- Production seeding should be avoided unless part of a controlled release process.

# Observability by Environment

## Local

- Developer console logs
- Optional local error tracking disabled by default

## Staging

- Must support debugging release candidates:
  - API logs available (Render)
  - Web runtime/deploy visibility available (Vercel)
  - Web and API error tracking enabled (Sentry)
- Noise should be minimized (hence staging gate)

## Production

- Must support incident response:
  - API logs available (Render)
  - Web runtime/deploy visibility available (Vercel)
  - Error tracking enabled (Sentry)
  - Alerts configured where feasible (at minimum via Sentry)

# Release Flow (Simplified)

1. Develop locally (local environment).
2. Use Vercel previews for UI review (preview environment).
3. Deploy to staging and run E2E checks (staging environment).
4. Promote to production after staging validation (production environment).

# Non-Goals

- This document does not define detailed infrastructure provisioning steps (DNS setup, Terraform, etc.).
- This document does not define product requirements or security/auth decision rationale (see ADRs for that).
