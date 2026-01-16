FROM node:24-trixie AS builder

WORKDIR /app

RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/

RUN pnpm install --frozen-lockfile

COPY . .

ENV NEXT_STANDALONE=true

RUN pnpm nx build web --configuration=production

RUN set -eux; ls -la /app/apps/web/.next; ls -la /app/apps/web/.next/standalone

FROM node:24-trixie AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["node", "server.js"]
