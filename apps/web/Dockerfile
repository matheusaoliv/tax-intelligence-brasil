FROM node:22-bookworm-slim

WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @tax-intelligence/web build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "--filter", "@tax-intelligence/web", "start"]
