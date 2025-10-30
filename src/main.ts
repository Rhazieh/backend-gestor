// backend-gestor/src/main.ts
// -----------------------------------------------------------------------------
// Punto de arranque del backend (NestJS). Acá se crea y se levanta el servidor.
// Pensalo como el "main" de un programa: prepara la app y la pone a escuchar.
// -----------------------------------------------------------------------------

// NestFactory: utilidad de Nest para crear la aplicación a partir de un módulo raíz.
import { NestFactory } from '@nestjs/core';
// AppModule: nuestro módulo raíz que agrupa configuración, módulos, controladores, etc.
import { AppModule } from './app.module';
// ValidationPipe: pipe global para validar/transformar datos entrantes (DTOs).
import { ValidationPipe } from '@nestjs/common';

/**
 * Guía de lectura (Backend - NestJS)
 * ----------------------------------------------------------------------------
  * ¿Qué hace esta app?
 * - Expone una API REST para gestionar Pacientes y Turnos (citas).
 * - Usa NestJS (arquitectura modular) + TypeORM (PostgreSQL).
 *
 * ¿Por dónde empiezo a leer?
 * 1) src/main.ts (este archivo)
 *    - Punto de entrada: arranque del servidor, CORS y ValidationPipe global.
 * 2) src/app.module.ts
 *    - Módulo raíz. Conecta ConfigModule, TypeOrmModule (DB) y módulos de dominio.
 *    - Enlaza PacientesModule y TurnosModule.
 * 3) src/pacientes/* y src/turnos/*
 *    - Estructura típica por feature:
 *      controller -> define endpoints HTTP
 *      service    -> lógica de negocio/acceso a datos
 *      entities   -> entidades TypeORM (tablas)
 *      dto        -> validaciones de entrada (class-validator)
 *
 * Flujo de una petición (ejemplo POST /turnos):
 * - Controller recibe el body -> Nest aplica ValidationPipe con DTO ->
 *   Service ejecuta reglas (chequea paciente, evita duplicados) ->
 *   Repositorio TypeORM guarda y devuelve la entidad.
 *
 * Configuración y entorno:
 * - Puerto: PORT o 3000 por defecto.
 * - DB: DATABASE_URL (Render/producción) o fallback local postgres://postgres:postgres@localhost:5432/turnos
 * - SSL en DB: habilitar con DATABASE_SSL=true para proveedores que lo requieran.
 * - CORS: habilitado para permitir front en distinto puerto.
 *
 * Archivos clave (lectura sugerida):
 * - src/main.ts
 * - src/app.module.ts
 * - src/pacientes/pacientes.controller.ts
 * - src/pacientes/pacientes.service.ts
 * - src/pacientes/entities/paciente.entity.ts
 * - src/turnos/turnos.controller.ts
 * - src/turnos/turnos.service.ts
 * - src/turnos/entities/turno.entity.ts
 */

// Función asíncrona que inicializa el servidor.
// Es async porque crear la app y ponerla a escuchar son operaciones que tardan.
async function iniciarApp() {
  // Creamos la app de Nest a partir del AppModule.
  // { cors: true } habilita CORS de forma simple (permite que el Front en otro dominio/puerto
  // pueda llamar a este backend). Para casos finos podríamos usar app.enableCors({...}).
  const app = await NestFactory.create(AppModule, { cors: true });

  // Registramos un "ValidationPipe" global:
  // - whitelist: true  -> si llegan campos extras que NO están en el DTO, los elimina.
  // - transform: true  -> intenta convertir tipos automáticamente (por ejemplo, "id" string a number).
  //   Esto hace que los controladores reciban datos ya "limpios" y con el tipo correcto.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Levantamos el servidor HTTP.
  // process.env.PORT -> lo usa el proveedor (ej. Render) para indicar el puerto en producción.
  // Si no existe, usamos 3000 por defecto para desarrollo local.
  await app.listen(process.env.PORT ?? 3000);
}

// Llamamos a la función para arrancar todo.
// Sin esta línea, el servidor no se iniciaría.
iniciarApp();

// ----------------------------------------------------------------------------