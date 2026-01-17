FROM node:24-slim AS deps

WORKDIR /repo

RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/.pnpm-store \
    pnpm config set store-dir /pnpm/.pnpm-store && \
    pnpm install --frozen-lockfile

FROM node:24-slim AS builder

WORKDIR /repo
ENV NODE_ENV=production

RUN corepack enable

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

ENV NEXT_STANDALONE=true

RUN pnpm nx build web --configuration=production

FROM node:24-trixie AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
USER node

COPY --from=builder --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /repo/apps/web/public ./apps/web/public

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["node", "server.js"]
