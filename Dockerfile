FROM node:22 AS dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM node:22 AS prod

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
ENV NODE_ENV=production
CMD ["npm", "run", "start"]