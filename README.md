Backend del proyecto "Gestor de Turnos Médicos", hecho en NestJS y conectado a una base de datos PostgreSQL. Permite manejar pacientes y sus turnos, con las funciones básicas (crear, editar, eliminar, listar).

Tecnologías usadas:
- NestJS
- PostgreSQL
- TypeORM
- Render (para el deploy)

Pasos para correrlo localmente:

1. Clonar el repo:
   git clone https://github.com/Rhazieh/backend-gestor.git

2. Instalar dependencias:
   npm install

3. Crear un archivo `.env` en la raíz con estos datos (adaptar a tu config):
   DB_HOST=localhost  
   DB_PORT=5432  
   DB_USERNAME=postgres  
   DB_PASSWORD=tu_contraseña  
   DB_NAME=gestor_db

4. Levantar el servidor:
   npm run start:dev

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
