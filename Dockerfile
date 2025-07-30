# Étape 1 : Build
FROM node:18-slim AS build

RUN apt-get update && \
    apt-get install -y openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

ENV LIGHTNINGCSS_FORCE_WASM=true

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Étape 2 : Runtime

FROM node:18-slim AS runtime

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma

EXPOSE 3005
