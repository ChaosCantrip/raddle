ARG NODE_VERSION=24.13.0-slim

# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/website-maintenance/package.json apps/website-maintenance/
COPY packages packages

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund;

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

RUN npm run build --workspace=@raddle/website-maintenance

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM node:${NODE_VERSION} AS runner

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/website-maintenance/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/website-maintenance/public ./apps/website-maintenance/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/website-maintenance/.next/static ./apps/website-maintenance/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/website-maintenance/server.js"]