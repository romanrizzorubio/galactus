# Multi-stage build para reducir tamaño final
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiar solo archivos de dependencias
COPY package*.json ./

# Instalar dependencias con optimizaciones para EC2 con poca RAM
RUN npm ci --maxsockets=1 --prefer-offline --no-audit --no-fund

# Copiar código fuente
COPY . .

# Build de producción (si aplica - descomenta si usas build)
# RUN npm run build

# Etapa final - imagen mínima
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar solo node_modules y código necesario
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
# Si haces build, copia el build en lugar del código fuente:
# COPY --from=builder /usr/src/app/build ./build
COPY . .

# Usuario no-root por seguridad
USER node

EXPOSE 3000

CMD ["npm", "start"]