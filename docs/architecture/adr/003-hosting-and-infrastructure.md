# ADR-003 — Prisma Hosting & Infrastructure (Render + Neon)

- **Status:** Accepted
- **Date:** 2026-01-17
- **Decision Owners:** Kaique Borges
- **Supersedes:** [ADR 001](./001-tech-stack.md) sections
  - **2.8 Hosting & Infrastructure**
  - **2.9 Observability**

## 1. Context

Prisma is a responsive personal finance management web application for Brazilian users. The MVP and early iterations prioritize **correctness**, **trust**, **fast iteration**, and **portfolio-grade engineering**, while keeping the system **economically sustainable** for a solo builder.

ADR 001 selected **Vercel (web) + AWS ECS/Fargate + RDS (API + data)** with **Sentry + CloudWatch** for observability. After cost modeling, the AWS portion (ALB/ECS/RDS plus operational overhead) is not feasible within the current budget constraints for a multi-month solo project.

Key decision drivers for revisiting hosting:

- **Cost sustainability:** must support always-on staging + production without runaway baseline costs.
- **Reduced ops burden:** minimize infrastructure complexity so time goes into product, correctness, and UX.
- **Correctness & trust:** Postgres remains a requirement for relational constraints and financial integrity.
- **Portfolio-grade practices:** maintain explicit backend API ownership, environment separation, secrets management, and observability.

## 2. Decision

### 2.1 Hosting & Infrastructure (updated)

- **Web**: remains **Vercel** for `apps/web` (Next.js).
- **API**: move from AWS ECS/Fargate to **Render** to run `apps/api` (Node.js + Express).
- **Database**: move from AWS RDS PostgreSQL to **Neon Postgres**.

Configuration boundaries:

- Web config continues in **Vercel environment variables**.
- API config moves to **Render environment variables and secrets**.
- Database connection strings are provided by Neon per environment and stored only in platform secrets.

### 2.2 Observability (updated)

- **Error tracking**: continue using **Sentry** for frontend and backend.
- **Logs**
  - API runtime logs are provided via **Render logs**.
  - Web logs remain via **Vercel** runtime/log tooling.
- **Metrics/alerts**
  - Use Render’s built-in service health and deploy visibility as the baseline.
  - Add targeted Sentry alerts (error rate, release health) as the primary early-warning mechanism.

> Note: CloudWatch is no longer a dependency for this phase.

## 3. Alternatives Considered

- **Keep AWS ECS/Fargate + RDS**
  - Rejected due to baseline cost and operational surface area for a solo builder.
- **DigitalOcean App Platform**
  - Considered; similar PaaS tradeoffs. Render chosen for faster iteration and simpler mental model for this project stage.
- **Supabase (platform)**
  - Rejected because Prisma’s portfolio goal is to demonstrate explicit backend design, not generated APIs and platform-driven backend behavior.

## 4. Consequences

### 4.1 Positive

- **Significantly reduced baseline cost**, enabling sustainable staging + production over months.
- **Faster iteration** and simpler deployments, helping avoid infra drag.
- Keeps **Postgres integrity** while reducing ops load (Neon-managed Postgres).
- Maintains **explicit backend ownership** (Express API remains the core system boundary).

### 4.2 Negative / Tradeoffs

- Reduced ability to demonstrate AWS-native operations (ALB/ECS/RDS, CloudWatch alarms).
- Observability shifts from CloudWatch metrics/alarms to **platform logs + Sentry**, which may be less configurable. Mitigation: Sentry provides error tracking and release health monitoring.
- Potential platform constraints (connection limits, cold starts, networking controls) depending on service tiers. Mitigation: choose appropriate Render + Neon plans as needed.
- Vendor lock-in increases with PaaS choices (Render + Neon).
