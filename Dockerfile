FROM node:24-trixie-slim AS dev

RUN apt-get update && apt-get upgrade -y && npm install --global npm@11.21.2 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM node:24-trixie-slim AS prod

RUN apt-get update && apt-get upgrade -y && npm install --global npm@11.21.2 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
