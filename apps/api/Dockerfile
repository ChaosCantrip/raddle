ARG NODE_VERSION=24.13.0

FROM node:${NODE_VERSION}-slim AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages packages

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build --workspace=@raddle/types
RUN npm run build --workspace=@raddle/common
RUN npm run build --workspace=@raddle/api

FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages packages

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --workspace=@raddle/api --no-audit --no-fund

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/packages/common/package.json ./packages/common/package.json
COPY --from=prod-deps /app/packages/types/package.json ./packages/types/package.json
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/apps/api/dist ./dist

RUN addgroup -S -g 1001 expressg && adduser -S -u 1001 -G expressg expressu
USER expressu

EXPOSE 3000
CMD ["node", "dist/server.js"]
