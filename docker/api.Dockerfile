FROM node:24-slim AS builder

WORKDIR /repo

RUN corepack enable

# Install openssl for Prisma ORM
RUN apt-get update && apt-get install -y openssl

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json tsconfig.json ./
COPY apps/api/package.json ./apps/api/package.json

# Copy all package.json files that are depended upon for nx build to work correctly
COPY packages/core/package.json ./packages/core/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/.pnpm-store \
    pnpm config set store-dir /pnpm/.pnpm-store && \
    pnpm install --frozen-lockfile

COPY . .

RUN pnpm nx build api --configuration=production

# Produce pruned production dependencies
RUN pnpm --filter @prisma-finance/api deploy --prod --legacy /out

RUN mkdir -p /out/dist && cp -R ./apps/api/dist/* /out/dist

FROM node:24-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /out ./

EXPOSE 3333

USER node

CMD ["node", "dist/index.js"]
