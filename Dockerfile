FROM node:24-trixie-slim AS base

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS deps

COPY package*.json ./
RUN npm ci

FROM base AS dev

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS builder

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS prod

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# npm is only needed during installation and build, never at runtime.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000
CMD ["node", "server.js"]
