FROM node:18-alpine AS base

# Install pnpm globally in base
RUN apk add --no-cache libc6-compat && npm install -g pnpm

WORKDIR /app

# -------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml* .npmrc* ./

RUN pnpm install --frozen-lockfile

# -------------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

# -------------------------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create app user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy only necessary assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
