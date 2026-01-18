FROM node:24-slim AS builder

WORKDIR /repo

RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY apps/web/package.json ./apps/web/

# Copy all package.json files that are depended upon for nx build to work correctly
COPY --parents packages/**/package.json .

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/.pnpm-store \
    pnpm config set store-dir /pnpm/.pnpm-store && \
    pnpm install --frozen-lockfile

COPY . .

ENV NEXT_STANDALONE=true

RUN pnpm nx build web --configuration=production

FROM node:24-slim AS runtime

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
