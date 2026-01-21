# ADR 005: Observability & Monitoring Stack

- **Status:** Accepted
- **Date:** 2026‑01‑20
- **Decision Owners:** Kaique Borges
- **Supersedes:** [ADR 003](./003-hosting-and-infrastructure.md) section
  - **2.9 Observability**

## 1. Context

Prisma is a modern personal finance application handling sensitive financial data for Brazilian users. Trust, reliability, and predictability are foundational to the product experience. To support this, Prisma requires an observability stack that allows a solo developer to:

- Detect errors and performance regressions quickly
- Monitor uptime and basic system health
- Track database performance and slow queries
- Understand user behavior for product decisions
- Maintain regulatory compliance (LGPD)

**Constraints:**

- **Price-sensitive:** Must rely on robust free tiers
- **Solo developer:** Tools must be simple to maintain and low‑cognitive‑load
- **Infrastructure:** Vercel (web), Render (API), Neon (database), Cloudflare perimeter
- **Privacy:** Avoid tools that conflict with the calm, privacy‑respecting tone of Prisma

This ADR defines the observability stack aligned with these constraints.

## 2. Decision

Prisma will adopt a **lightweight, free‑tier‑first, defense‑in‑depth observability stack** composed of:

### **2.1. Error Tracking & Performance Monitoring → Sentry**

Sentry will be used for:

- API and frontend error tracking
- Error grouping and deduplication
- Basic performance monitoring (APM-lite)
- Release health tracking

**Rationale:**

- Best free-tier for solo builders
- Great developer UX
- Easy integration with both Next.js and Express

### **2.2. Product Analytics → PostHog**

PostHog will be used for:

- Event-based product analytics
- Funnel analysis and onboarding drop-off
- Feature adoption measurement
- Retention and engagement insights

**Rationale:**

- Privacy-first, aligned with LGPD
- Generous free tier
- Owned events model, no black-box dashboards

### **2.3. Uptime & Synthetic Monitoring → Better Stack**

Better Stack will be used for:

- Uptime monitoring of web and API
- SSL expiration checks
- Periodic synthetic tests

**Rationale:**

- Modern UI, fast setup
- Solid free tier
- Email alerts

### **2.4. Database Monitoring → Neon Built‑In Metrics**

Neon’s native tools will be used for:

- Slow query logging
- Connection pool metrics
- CPU/memory/storage monitoring

**Rationale:**

- Zero cost
- First-class PostgreSQL visibility
- Better than running a custom monitoring agent

### **2.5. Security Observability → Cloudflare Analytics**

Cloudflare analytics will monitor:

- WAF rule triggers
- Rate limiting hits
- Bot traffic
- Access anomalies

**Rationale:**

- Already the perimeter from [ADR 004](./004-environment-protection-and-security.md)
- Free analytics aligned with the security boundary
- Complements application-level signals

### **2.6. Logging → Hosting Provider Native Logs**

- Vercel logs for the web app
- Render logs for the API

**Rationale:**

- Free, sufficient for a solo product
- No need for centralized logging (e.g., Datadog, ELK) yet
- Low maintenance

## 3. Alternatives Considered

### **3.1. Datadog / New Relic / Grafana Cloud**

**Rejected:** Too expensive, too complex, overkill for solo project.

### **3.2. Self-hosted analytics (PostHog / Plausible)**

**Rejected:**

- Requires additional DevOps and hosting complexity
- Cloud-hosted free tier is sufficient

### **3.3. Full OpenTelemetry Pipeline**

**Rejected:**

- Unnecessary for current scale
- High complexity for little marginal benefit

## 4. Consequences

### **4.1. Positive**

- Zero- to low-cost setup using free tiers
- Strong developer ergonomics
- Covers all essential observability pillars (errors, performance, uptime, analytics)
- Minimal operational burden

### **5.2. Negative**

- Free tier limits may require tuning
- No centralized logging may make debugging multi-system failures harder
- PostHog event limits may trigger future upgrades

### **5.3. Risks and Mitigations**

- **Event volume spikes:** Monitor free-tier consumption monthly
- **Analytics drift:** Use a minimalist event model to avoid tracking bloat

## 5. Future Considerations

- Full metrics ingestion via OpenTelemetry (if needed)
- Centralized log storage (Logtail, Grafana Cloud)
- Additional synthetic flows for onboarding
- More advanced dashboards for business metrics
- DevOps automation for health dashboards
