FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install @azure/storage-blob
RUN npm install @azure/identity
COPY . ./
RUN npm run build

CMD node build
