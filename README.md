Backend del proyecto "Gestor de Turnos Médicos", hecho en NestJS y conectado a una base de datos PostgreSQL. Permite manejar pacientes y sus turnos, con las funciones básicas (crear, editar, eliminar, listar).

Tecnologías usadas:
- NestJS
- PostgreSQL
- TypeORM
- Render (para el deploy)

Pasos para correrlo localmente (localhost:3000):

1) Instalar dependencias

   npm install

2) Levantar PostgreSQL (opcional pero recomendado con docker-compose)

   docker compose -f docker-compose.yml up -d

   Esto te deja una base accesible en postgres://postgres:postgres@localhost:5432/turnos

3) Crear variables de entorno

   Copiá `.env.example` a `.env` y ajustá si hace falta. Por defecto, si no configurás nada,
   el backend usará la URL local de arriba y el puerto 3000.

   cp .env.example .env

4) Ejecutar en desarrollo (watch)

   npm run start:dev

   La API quedará en http://localhost:3000 con CORS habilitado.

Endpoints disponibles:

Pacientes:
- GET /pacientes
- POST /pacientes
- GET /pacientes/:id
- PATCH /pacientes/:id
- DELETE /pacientes/:id

Turnos:
- GET /turnos
- POST /turnos
- GET /turnos/:id
- PATCH /turnos/:id
- DELETE /turnos/:id

Filtros (Turnos):
- GET /turnos?fecha=YYYY-MM-DD
- GET /turnos?pacienteId=ID
- GET /turnos?fecha=YYYY-MM-DD&pacienteId=ID

Turnos por paciente:
- GET /pacientes/:id/appointments
- POST /pacientes/:id/appointments

Modelo de base de datos:

Un paciente puede tener varios turnos (relación 1:N)

paciente:
- id
- nombre
- email
- telefono

turno:
- id
- fecha
- hora
- razon
- pacienteId

Deploy en Render (puede tardar unos segundos en arrancar si estuvo inactivo):  
https://backend-gestor-zfez.onrender.com

Colección Postman:
- Archivo: postman_collection.json (incluido en este repo)
- Cómo usar:
   1) Abrí Postman, Import > File > seleccioná postman_collection.json
   2) Definí la variable de entorno `baseUrl` si querés apuntar a Render en vez de localhost
       (por defecto ya apunta a http://localhost:3000).
   3) Probá los requests: CRUD de Pacientes, CRUD de Turnos, Filtros y Appointments anidados.

Repositorio del frontend:  
https://github.com/Rhazieh/frontend-gestor

Indice de lectura recomendado:
1. backend-gestor/src/main.ts


2. backend-gestor/src/app.module.ts


3. backend-gestor/src/pacientes/entities/paciente.entity.ts


4. backend-gestor/src/turnos/entities/turno.entity.ts


5. backend-gestor/src/pacientes/dto/create-paciente.dto.ts


6. backend-gestor/src/pacientes/dto/update-paciente.dto.ts


7. backend-gestor/src/turnos/dto/create-turno.dto.ts


8. backend-gestor/src/turnos/dto/update-turno.dto.ts


9. backend-gestor/src/pacientes/pacientes.service.ts


10. backend-gestor/src/turnos/turnos.service.ts


11. backend-gestor/src/pacientes/pacientes.controller.ts


12. backend-gestor/src/turnos/turnos.controller.ts


13. backend-gestor/src/pacientes/pacientes.module.ts


14. backend-gestor/src/turnos/turnos.module.ts
