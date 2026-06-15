FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production --maxsockets=1 --prefer-offline

COPY . .

EXPOSE 4000

CMD ["npm", "start"]