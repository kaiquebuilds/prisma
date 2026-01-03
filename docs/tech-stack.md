# Tech Stack

Prisma's tech stack was chosen to balance **learning outcomes** with **production readiness**.

## Frontend

**React + TypeScript + Vite + Tailwind CSS**

Why: React's component model and TypeScript's type safety are industry standards for building scalable UIs. Vite provides exceptional developer experience with near-instant HMR. Tailwind enables scalable CSS with co-located styles and faster development with minimal context-switching.

**React Query + Zustand**

Why: React Query handles server state (data fetching, caching, synchronization). Zustand manages UI state with minimal boilerplate.

## Backend

**Node.js + Express + TypeScript**

Why: Express's flexibility allows me to build a clean architecture from first principles. TypeScript ensures type safety across the API.

Trade-off: Express over NestJS for the backend was intentional, as I wanted to understand architectural patterns from first principles rather than relying on framework conventions.

**Prisma ORM + PostgreSQL**

Why: Prisma provides type-safe database access with excellent migrations. Postgres is ACID-compliant and ideal for financial data requiring strong consistency guarantees.

## Testing

**Vitest + React Testing Library + Playwright**

Why: Vitest for fast unit/component tests. Playwright for reliable E2E tests across all modern browsers. This implements a testing pyramid: many fast unit tests, fewer critical E2E tests.

## Infrastructure

**Docker + GitHub Actions + AWS**

Why: Docker ensures consistent environments across dev/test/prod. GitHub Actions automates build, test, and deployment pipelines. AWS provides managed services (S3 for static assets, EC2 for backend, Vercel for frontend).

## Trade-offs & Assessment

**Why Express over NestJS?**

Express's unopinionated nature forced me to design architecture intentionally. This deeper understanding is more valuable than using a framework that provides these by default.

**What I'd do differently at scale:**

- Opinionated frameworks (NestJS) for larger teams to enforce consistency
- Redis for advanced caching strategies
- Advanced DevOps with infrastructure as code (Terraform) for complex deployments
- Monorepo structure if there was a need for shared code across applications

## Learning Outcomes

This stack strengthened my expertise in:

- **Architectural thinking:** Designing systems from first principles, understanding trade-offs
- **End-to-end ownership:** Taking a project from concept to production
- **DevOps & cloud:** Docker, CI/CD, AWS deployment
