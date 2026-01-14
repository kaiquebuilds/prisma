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

RUN pnpm nx build web --configuration=production

FROM node:24-trixie AS runtime

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder app/apps/web/.next/standalone ./
COPY --from=builder app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder app/apps/web/public ./apps/web/public

EXPOSE 3000

WORKDIR /app/apps/web

CMD ["node", "server.js"]
