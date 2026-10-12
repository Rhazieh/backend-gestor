// backend-gestor/src/main.ts
// -----------------------------------------------------------------------------
// Punto de arranque
// Acá yo creo y levanto el servidor Nest. Es literalmente mi “main”: preparo
// la app, configuro validación global y la pongo a escuchar.
// -----------------------------------------------------------------------------

// Acordate: NestFactory es la "fábrica" para crear la app desde el módulo raíz.
import { NestFactory } from '@nestjs/core';
// AppModule es el módulo raíz que armé con config, DB y módulos de dominio.
import { AppModule } from './app.module';
// ValidationPipe: mi “filtro” global para validar/transformar DTOs antes de llegar al controller.
import { ValidationPipe } from '@nestjs/common';

/**
 * Mini mapa mental (para defender tranquilo):
 * - Qué hace mi app: API REST para Pacientes y Turnos usando NestJS + TypeORM (Postgres).
 * - Cómo la organicé: módulos por dominio (pacientes/turnos) con controller → service → entity → dto.
 * - Flujo típico (ej. POST /turnos): Controller recibe → ValidationPipe valida DTO →
 *   Service aplica reglas (existe paciente, no duplica fecha+hora) → Repo TypeORM persiste.
 * - Entorno: PORT o 3000, DATABASE_URL (o fallback local), DATABASE_SSL si el proveedor lo exige.
 * - CORS: lo habilito porque mi front puede vivir en otro origen.
 */

// Creo una función async porque crear la app y hacer listen son operaciones IO.
async function iniciarApp() {
  // Acá le pido a Nest que me cree la aplicación a partir de AppModule.
  // Activo CORS simple ({ cors: true }) para que el front (otro puerto) me pueda pegar.
  // Si necesito algo más fino, tengo app.enableCors({ ... }).
  const app = await NestFactory.create(AppModule, { cors: true });

  // Registro un ValidationPipe global porque quiero datos limpios antes del controller:
  // - whitelist: true  → si llegan campos que NO están en el DTO, Nest los saca.
  // - transform: true  → intenta convertir tipos (ej: "id" string → number) automáticamente.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Levanto el servidor HTTP. En prod confío en process.env.PORT (Render/Heroku),
  // y en dev me planto en 3000.
  await app.listen(process.env.PORT ?? 3000);
}

// Arranco todo. Sin este llamado, nada corre.
void iniciarApp();

// ----------------------------------------------------------------------------
