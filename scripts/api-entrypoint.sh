#!/usr/bin/env sh
set -eu

npx prisma migrate deploy --schema ./prisma/schema.prisma

node dist/index.js
