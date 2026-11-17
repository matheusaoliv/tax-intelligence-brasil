FROM node:22-bookworm-slim

WORKDIR /app
RUN corepack enable

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @tax-intelligence/web build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "--filter", "@tax-intelligence/web", "start"]
