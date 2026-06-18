ARG NODE_VERSION=24.13.0-slim

FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages packages

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
WORKDIR /app/apps/api
RUN npm run build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=dependencies /app/node_modules ./node_modules

RUN addgroup --system --gid 1001 expressg
RUN adduser --system --uid 1001 expressu
USER expressu

EXPOSE 3000
CMD ["node", "dist/server.js"]
