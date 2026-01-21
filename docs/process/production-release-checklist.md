# Prisma Release Checklist

This checklist defines the required steps to safely promote a release from **staging** to **production**.
It ensures correctness, security, and trustworthiness while keeping the flow lightweight for a solo developer.

## 1. CI & Test Requirements

1. All unit tests pass
2. All integration tests pass
3. **All E2E tests pass against staging**
4. No flaky or unstable tests related to the slice being released

## 2. Staging Environment Validation

1. Staging web loads correctly (`app.staging.prismafinance.app`)
2. Staging API responds correctly (`api.staging.prismafinance.app`)
3. Authentication works end‑to‑end using **staging Clerk**
4. IP allowlist for staging is correct (developer IP + CI/CD)
5. Rate limiting configured for any new routes
6. No unexpected blocks in Cloudflare Firewall Events
7. No Sentry errors for the changed areas in staging

## 3. Database & Migrations

1. All migrations applied successfully in staging
2. Schema validated (no unintended changes)
3. Migration is safe for production (backwards compatible if needed)
4. No performance regressions in Neon staging metrics

## 4. Observability Check

1. Sentry shows no new staging errors
2. Better Stack monitors are green
3. Cloudflare analytics show no anomalies
4. Vercel and Render logs do not show new warnings or error spikes

## 5. Manual Sanity Pass (5 minutes)

1. Login flow works
2. Creating a manual transaction works
3. Editing or deleting the transaction works
4. Relevant read-only views render correctly
5. Navigation and SSR/ISR behave as expected

## 6. Versioning & Documentation

1. Documentation updated for the slice
2. Changelog entry added
3. Any impacted ADRs reviewed and updated

## 7. Release Safety Gate

Before deploying to production, confirm:

1. Staging and production configs mirror each other (minus secrets)
2. Clerk issuer/audience separation is correct
3. Production env vars validated in Vercel, Render, and Neon
4. Cloudflare production DNS/WAF setup untouched and correct
5. No unreviewed breaking changes

## 8. Promote to Production

1. Deploy web (Vercel)
2. Deploy API (Render)
3. Run migrations in production
4. Verify production logs for errors post‑deploy
5. Perform a quick manual production sanity test

## 9. Post‑Release Monitoring

1. Watch logs and Sentry for 10–15 minutes
2. Check Better Stack uptime
3. Validate Cloudflare analytics for unusual activity

## Notes

- Staging must always stay ahead of production.
- All changes flow: local → preview → staging → production.
- Staging and production never share Clerk tenants or databases.
