#!/usr/bin/env sh
set -eu

echo "node: $(node -v)"
echo "npm:  $(npm -v)"

npx -y pnpm@10.28.0 -v

npx -y pnpm@10.28.0 install --frozen-lockfile
npx -y pnpm@10.28.0 --filter @prisma-finance/api run db:migrate:deploy
