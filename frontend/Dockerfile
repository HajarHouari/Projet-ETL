FROM node:20-slim AS build-stage
WORKDIR /app

COPY package*.json ./

# On alloue 4Go de RAM au processus npm/node
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm install

COPY . .
RUN npm run build