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