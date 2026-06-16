# Multi-stage build para monorepo
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiar package.json del monorepo y workspaces
COPY package*.json ./
COPY packages/back/package*.json ./packages/back/
COPY packages/front/package*.json ./packages/front/

# Instalar todas las dependencias del monorepo
RUN npm install --maxsockets=1 --prefer-offline --no-audit --no-fund

# Copiar todo el código
COPY . .

# Etapa final - imagen mínima solo con backend
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar node_modules del monorepo y código del backend
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages/back ./packages/back
COPY --from=builder /usr/src/app/package*.json ./

WORKDIR /usr/src/app/packages/back

EXPOSE 4000

CMD ["npm", "start"]