# 1. Imagen oficial de Node.js.
FROM node:20-alpine

# 2. Directorio de trabajo dentro del container.
WORKDIR /app

# 3. Copiar manifestos de dependencias primero para aprovechar el caché.
COPY package*.json ./

# 4. Instalar todas las dependencias.
RUN npm ci

# 5. Copiar el resto del codigo del backend.
COPY . .

# 6. Compilar codigo typescript a javascript, genera la carpeta /dist.
RUN npm run build

# 7. Exponer el puerto donde escucha la API de nestjs
EXPOSE 3000

# 8. Comando de ejecucion al iniciar el container.
CMD ["npm", "run", "start:prod"]

