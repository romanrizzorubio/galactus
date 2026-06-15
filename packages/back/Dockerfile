FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production --maxsockets=1

COPY . .

EXPOSE 4000

CMD ["npm", "start"]