# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and migrations
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the entire project
COPY . ./

# Increase memory limit to prevent heap out-of-memory crashes
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NODE_ENV=production

# Build the project
RUN pnpm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Copy Prisma files and migrations
COPY --from=build /app/prisma ./prisma

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

# Install prisma and tsx globally
RUN pnpm install -g prisma

EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]
