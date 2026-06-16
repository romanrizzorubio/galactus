# Multi-stage build para reducir tamaño final
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiar solo archivos de dependencias
COPY package*.json ./

# Instalar dependencias con optimizaciones para EC2 con poca RAM
RUN npm ci --only=production --maxsockets=1 --prefer-offline --no-audit --no-fund

# Etapa final - imagen mínima
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar solo node_modules y código necesario
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY . .

# Usuario no-root por seguridad
USER node

EXPOSE 4000

CMD ["npm", "start"]