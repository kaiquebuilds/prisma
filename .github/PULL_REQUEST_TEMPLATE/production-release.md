## CI & Tests

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] **E2E tests pass against staging**
- [ ] No new flaky tests

## Staging Validation

- [ ] Staging web loads (`app.staging.prismafinance.app`)
- [ ] Staging API responds (`api.staging.prismafinance.app`)
- [ ] Auth works end‑to‑end with staging Clerk
- [ ] IP allowlist for staging is valid
- [ ] Rate limiting added for new routes
- [ ] No unexpected Cloudflare firewall blocks
- [ ] No new Sentry errors in staging

## Database & Migrations

- [ ] Migrations applied to staging
- [ ] Schema validated
- [ ] Migration is safe for production

## Observability

- [ ] Sentry clean
- [ ] Better Stack monitors are green
- [ ] Vercel & Render logs look healthy

## Manual Sanity Test

- [ ] Login works
- [ ] Creating/editing/deleting a transaction works
- [ ] UI views render correctly
- [ ] Navigation & SSR work normally

## Docs & Changelog

- [ ] Documentation updated
- [ ] Changelog updated
- [ ] ADR updates (if required)

## Final Safety Gate

- [ ] Production env vars validated
- [ ] Clerk issuer/audience correct for production
- [ ] Cloudflare production DNS/WAF unchanged
- [ ] No breaking changes unreviewed

## Deployment

- [ ] Deploy web to Vercel
- [ ] Deploy API to Render
- [ ] Run production migrations
- [ ] Manual production sanity test completed
- [ ] Logs monitored 10–15 minutes post‑deploy
