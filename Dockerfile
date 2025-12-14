# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
COPY tsconfig*.json ./
COPY .env.production .env.production
RUN npm install

# Copy source
COPY . .

# Build static assets
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets only
COPY --from=builder /app/dist ./dist

# Lightweight static server
RUN npm install -g serve@14

# Vite preview default port (can change as needed)
EXPOSE 8080

# Start static file server
CMD ["serve", "-s", "dist", "-l", "8080"]
