FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --maxsockets=1 --prefer-offline

COPY . .

EXPOSE 3000

CMD ["npm", "start"]