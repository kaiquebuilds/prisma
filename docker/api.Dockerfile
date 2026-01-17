FROM node:24-slim AS deps

WORKDIR /repo

RUN corepack enable

RUN apt-get update && apt-get install -y openssl

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json tsconfig.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/core/package.json ./packages/core/package.json

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/.pnpm-store \
    pnpm config set store-dir /pnpm/.pnpm-store && \
    pnpm install --frozen-lockfile

FROM node:24-slim AS builder

WORKDIR /repo
ENV NODE_ENV=production

RUN corepack enable

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

RUN pnpm nx build api --configuration=production

RUN pnpm --filter @prisma-finance/api run db:generate

# Produce pruned production dependencies
RUN pnpm --filter @prisma-finance/api deploy --prod --legacy /out

RUN mkdir -p /out/dist && cp -R ./apps/api/dist/* /out/dist

FROM node:24-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /out ./

EXPOSE 3333

CMD ["node", "dist/index.js"]
