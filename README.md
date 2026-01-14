# ![Prisma 💎](https://github.com/user-attachments/assets/e4cc43bb-5bb2-4d10-b218-8fee4e3c90af)

![Status](https://img.shields.io/badge/Status-Under_Development-orange?style=flat-square) ![License](https://img.shields.io/github/license/kaiquebuilds/prisma?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square)

> **A “Safe-to-Spend” personal finance app tailored for Brazilian users.**

Prisma is a full-stack personal finance web application currently under active development. It focuses on reducing **financial anxiety** and increasing **clarity** by making obligations, cashflow, and “can I afford this?” decisions easy to answer—especially under Brazil-specific realities like **credit card installments (_parcelado_)**.

The product is built around one simple question:

> _“Can I buy this today without ruining my month?”_

## 📌 Core Outcomes (what Prisma Optimizes for)

- **Clarity:** show what’s happening now and what’s coming next.
- **Predictability:** surface upcoming obligations and their impact on cashflow.
- **Confidence:** provide a practical “safe-to-spend” view grounded in real dates and obligations.

## 👥 Target Users

Prisma is designed around two primary archetypes:

- **Alex (The Planner):** wants optimization, planning, and visibility into where money goes.
- **Juliana (The Overwhelmed):** wants simplicity, reduced stress, and clear upcoming obligations.

See details in: **[Product Personas](./docs/product/personas.md)**

## 📚 Documentation Hub

This repository is a living artifact of the engineering process: decisions, trade-offs, and reasoning are documented as the system evolves.

- **[Architecture Decision Records (ADRs)](./docs/architecture/adr):** Key technical decisions made during development.
- **[Tech Stack Rationale (ADR-001)](./docs/architecture/adr/001-tech-stack.md):** Why this stack and architecture were chosen.
- **[Learnings](./docs/learnings.md):** Challenges encountered and solutions explored.
- **[Product Personas](./docs/product/personas.md):** The user archetypes guiding UX and product decisions.

## 🗺️ Roadmap & Progress Tracking

Development progress is tracked on the **[Project Board](https://github.com/users/kaiquebuilds/projects/3)**.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Next.js, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Quality:** Vitest, Playwright, GitHub Actions (CI)
- **DevOps:** Docker Compose
- **Cloud:** Vercel (frontend), AWS (backend + database)
- **Monitoring:** Sentry, CloudWatch

## ▶️ Quickstart (demo Prisma)

> The goal is a low-friction setup where a reviewer can run Prisma locally with minimal steps.

### Prerequisites

- **Docker** + **Docker Compose**

### Run

1. Start the stack:

   - `docker compose up --build`

2. Open the web app:

   - Web should be available on the configured port (commonly `http://localhost:3000`)

3. Verify the API is reachable:
   - API health endpoint should respond (commonly `/v1/health`)

> If ports differ, check the repository’s Docker Compose configuration and environment variables.

## 🎨 UX/UI Design (Figma)

UX is designed around reducing cognitive load for the target personas and keeping core flows consistent across desktop and mobile.

[**View the Figma project ↗**](https://www.figma.com/design/8KpQd8icZsnr1Riu0PjUKr/Prisma?node-id=19496-25008&t=xnkyq6EyIBX9pHn9-1)

![Figma Preview](https://github.com/user-attachments/assets/298d8fca-d7c9-4ab8-9835-55ba4da3f502)

## 📄 License

Licensed under **GNU AGPL v3.0**.

## 📩 Contact

Created by **Kaique**.

- **Email:** rique.kaique@gmail.com
- **LinkedIn:** [/in/kaiquecborges/](https://www.linkedin.com/in/kaiquecborges/)
