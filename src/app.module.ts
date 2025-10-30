// backend-gestor/src/app.module.ts
// -----------------------------------------------------------------------------
// MÓDULO RAÍZ (así arranca todo)
// Acá decido “enchufar” todo lo fundamental del backend: leer variables de
// entorno (.env), abrir la conexión a Postgres con TypeORM y registrar mis
// módulos de dominio (pacientes y turnos). Importante: cuando en main.ts
// hago NestFactory.create(AppModule), Nest empieza desde este módulo.
// -----------------------------------------------------------------------------

// Acordate: @Module es una “etiqueta” que le dice a Nest que esta clase es un
// módulo. Acá declaro QUÉ importo, QUÉ providers tengo y QUÉ expongo.
import { Module } from '@nestjs/common';

// Decidí usar ConfigModule para leer variables de entorno (ej: DATABASE_URL).
import { ConfigModule } from '@nestjs/config';

// TypeOrmModule integra TypeORM (el ORM) con Nest para hablar con Postgres.
import { TypeOrmModule } from '@nestjs/typeorm';

// Mis módulos de negocio: los separo por dominio para mantener ordenado.
import { PacientesModule } from './pacientes/pacientes.module';
import { TurnosModule } from './turnos/turnos.module';

@Module({
  imports: [
    /**
     * ConfigModule.forRoot()
     * ¿Por qué lo activo acá y global?
     * - Quiero leer .env una sola vez y que esté disponible en toda la app
     *   sin tener que reimportarlo (isGlobal: true). Así puedo hacer
     *   process.env.X en cualquier módulo/servicio.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * Conexión a Postgres con TypeORM
     * Mi objetivo: que funcione tanto local (docker-compose) como en producción
     * (Render/Heroku) sin cambiar código.
     * Acordate que:
     * - synchronize: true me auto-sincroniza entidades ↔ tablas (lo dejo para
     *   desarrollo; en prod ideal migraciones).
     * - autoLoadEntities: true me evita registrar cada entidad a mano.
     * - Si DATABASE_SSL === 'true', activo SSL “tolerante” (útil en proveedores
     *   que usan certificados intermedios).
     */
    // Ojo: si no hay DATABASE_URL, caigo a un Postgres local para dev.
    // Importante: SSL sólo si DATABASE_SSL === 'true'.
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ??
        'postgres://postgres:postgres@localhost:5432/turnos',
      synchronize: true,
      autoLoadEntities: true,
      ssl: process.env.DATABASE_SSL === 'true' ? true : false,
      extra:
        process.env.DATABASE_SSL === 'true'
          ? {
              ssl: { rejectUnauthorized: false },
            }
          : undefined,
    }),

    /**
     * Módulos de dominio que yo mismo armé:
     * - PacientesModule: rutas, servicio y entidad de pacientes.
     * - TurnosModule: rutas, servicio y entidad de turnos.
     * Esto mantiene el código modular y fácil de defender en la presentación.
     */
    PacientesModule,
    TurnosModule,
  ],
  // Nota para mí: este módulo raíz no necesita controllers/providers propios.
  controllers: [],
  providers: [],
})
export class AppModule {}

// -----------------------------------------------------------------------------
