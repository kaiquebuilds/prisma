FROM node:24-alpine

RUN corepack enable

WORKDIR /repo

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY apps/api/prisma ./apps/api/prisma

CMD ["pnpm","--filter","@prisma-finance/api","run","db:migrate:deploy"]
