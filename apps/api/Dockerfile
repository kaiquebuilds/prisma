FROM node:24-trixie AS builder

WORKDIR /app

RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm nx build api --configuration=production

# Puts shared workspace prod dependencies alongside the project
RUN pnpm --filter @prisma-finance/api deploy --prod --legacy /out

RUN mkdir -p /out/dist && cp -R ./apps/api/dist/* /out/dist

RUN cp ./apps/api/prisma.config.ts /out/prisma.config.ts
RUN mkdir -p /out/prisma && cp -R ./apps/api/prisma/* /out/prisma

FROM node:24-trixie AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN corepack enable

COPY --from=builder /out ./

EXPOSE 3333

CMD ["node", "dist/index.js"]
