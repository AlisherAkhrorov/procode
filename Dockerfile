FROM node:21-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install ---production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]