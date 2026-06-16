# Galactus Monorepo

Este proyecto es un monorepo que contiene el backend y el frontend de Galactus.

## Requisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (opcional, para despliegue con Docker)

## Instalación

Desde la raíz del proyecto, instala todas las dependencias de ambos paquetes (back y front) ejecutando:

```bash
npm install
```

## Ejecución con NPM

Para levantar el proyecto localmente usando npm, puedes iniciar ambos servicios a la vez o de forma independiente.

### Levantar ambos servicios (Recomendado)
Desde la raíz, ejecuta:
```bash
npm start
```
Esto usará `concurrently` para lanzar el backend y el frontend simultáneamente.

### Levantar de forma independiente

#### Levantar el Backend
```bash
npm start --workspace=back
```
El backend estará disponible en [http://localhost:4000](http://localhost:4000).

#### Levantar el Frontend
```bash
npm start --workspace=front
```
El frontend estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Ejecución con Docker

Si prefieres usar Docker, puedes levantar ambos servicios de forma orquestada con un solo comando.

### Construir y Levantar
```bash
docker compose up --build
```

Esto levantará:
- **Backend** en el puerto `4000`
- **Frontend** en el puerto `3000`

### Build Secuencial (Para EC2 con poca RAM)
Si el build paralelo se queda atascado en `npm install`, usa build secuencial:
```bash
docker compose build back && docker compose build front && docker compose up
```

O con reconstrucción completa sin caché:
```bash
docker compose build --no-cache back && docker compose build --no-cache front && docker compose up
```

### Opción B: Build Optimizado para Espacios Limitados (Recomendado para EC2)
Si tienes un EC2 con poco espacio en disco o RAM limitada, sigue este proceso optimizado:

```bash
# 1. Limpiar Docker completamente
docker compose down
docker system prune -a --volumes -f

# 2. Verificar espacio disponible
df -h

# 3. Build secuencial optimizado (construye uno a la vez para reducir uso de RAM)
docker compose build --no-cache back && \
docker compose build --no-cache front && \
docker compose up -d

# 4. Limpiar imágenes intermedias
docker image prune -f
```

**Si aún necesitas más espacio, expande el volumen EBS:**
```bash
# Primero, identifica tu dispositivo de disco:
lsblk

# Después de modificar el tamaño del volumen en AWS Console, usa uno de estos:
# Para /dev/xvda (instancias antiguas):
sudo growpart /dev/xvda 1
sudo resize2fs /dev/xvda1

# Para /dev/nvme0n1 (instancias modernas t3, t4g, etc):
sudo growpart /dev/nvme0n1 1
sudo resize2fs /dev/nvme0n1p1

# Verificar el nuevo espacio disponible
df -h
```

### Detener los servicios
```bash
npm run docker:stop
```

O directamente con Docker:
```bash
docker compose down
```

### Reconstrucción Completa (Limpieza de Espacio)
Para reconstruir las imágenes desde cero limpiando contenedores, imágenes antiguas y volúmenes (ideal para ahorrar espacio en disco tras cambios), ejecuta:
```bash
npm run docker:reload
```
Este comando:
1. Libera los puertos 3000 y 4000 matando cualquier proceso que los esté usando.
2. Detiene y elimina contenedores, imágenes de los servicios y volúmenes huérfanos.
3. Construye las imágenes sin usar caché para asegurar que se incluye el código nuevo.
4. Levanta los servicios en segundo plano.
5. Elimina imágenes "dangling" (sueltas) que queden en el sistema.

## Estructura del Proyecto

- `back/`: Servidor Express (API).
- `front/`: Aplicación React (Frontend).
- `docker-compose.yml`: Configuración de orquestación de Docker.
- `.gitignore`: Archivo para ignorar archivos de configuración de IDE (como `.idea`).

## Scripts Disponibles (Raíz)

| Comando | Descripción |
| :--- | :--- |
| `npm install` | Instala dependencias en todo el monorepo. |
| `npm start` | Levanta backend y frontend simultáneamente con `concurrently`. |
| `npm run docker:reload` | **Recomendado para Docker**: Limpia, reconstruye y levanta todo desde cero. |
| `npm run docker:stop` | Detiene todos los servicios de Docker. |
| `npm run docker:free-ports` | Libera los puertos 3000 y 4000 manualmente. |
