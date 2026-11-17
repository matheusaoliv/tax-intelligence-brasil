FROM node:22-bookworm-slim

WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @tax-intelligence/api db:generate
RUN pnpm --filter @tax-intelligence/api build

ENV NODE_ENV=production
EXPOSE 3001
CMD ["pnpm", "--filter", "@tax-intelligence/api", "start"]
