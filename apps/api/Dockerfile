# =========================
# 1. Dependencies
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# Install deps separately for better caching
COPY package.json package-lock.json* ./
RUN npm ci

# =========================
# 2. Builder
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript
RUN npm run build

# =========================
# 3. Runner (minimal)
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy what's needed
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json* ./

# Install only production deps
RUN npm ci --omit=dev

# Expose port (optional but good practice)
EXPOSE 3000

# Run compiled app
CMD ["node", "dist/server.js"]