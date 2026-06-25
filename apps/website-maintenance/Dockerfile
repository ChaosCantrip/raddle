ARG NODE_VERSION=24.13.0

FROM node:${NODE_VERSION}-slim AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/website-maintenance/package.json apps/website-maintenance/
COPY packages packages

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build --workspace=@raddle/website-maintenance

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/website-maintenance/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/website-maintenance/public ./apps/website-maintenance/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/website-maintenance/.next/static ./apps/website-maintenance/.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "apps/website-maintenance/server.js"]
