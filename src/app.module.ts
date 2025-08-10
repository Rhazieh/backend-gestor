// backend-gestor/src/app.module.ts
// -----------------------------------------------------------------------------
// MÓDULO RAÍZ DEL BACKEND (NestJS)
// Acá “enchufamos” todo: configuración de variables de entorno (.env),
// conexión a la base de datos (TypeORM + Postgres) y los módulos de dominio
// (pacientes y turnos). Cuando en main.ts hacemos NestFactory.create(AppModule),
// Nest arranca desde este módulo.
// -----------------------------------------------------------------------------

// @Module me permite declarar qué importa, qué provee y qué expone este módulo.
import { Module } from '@nestjs/common';

// ConfigModule: habilita leer variables de entorno (por ejemplo DATABASE_URL).
import { ConfigModule } from '@nestjs/config';

// TypeOrmModule: integra TypeORM (el ORM) con Nest.
import { TypeOrmModule } from '@nestjs/typeorm';

// Nuestros módulos de funcionalidad.
import { PacientesModule } from './pacientes/pacientes.module';
import { TurnosModule } from './turnos/turnos.module';

@Module({
  imports: [
    /**
     * ConfigModule.forRoot():
     * - Carga variables de entorno (por defecto busca un archivo .env en la raíz).
     * - isGlobal: true → lo hace disponible en toda la app sin re-importar.
     *   Ej: process.env.DATABASE_URL va a estar accesible en cualquier parte.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * Conexión a la base con TypeORM (PostgreSQL):
     * - type: 'postgres' → motor de la base.
     * - url: process.env.DATABASE_URL → string de conexión completa (usuario, pass, host, puerto, DB).
     * - synchronize: true → AUTO-sincroniza entidades ↔ tablas.
     *      ⚠ Útil en desarrollo. En producción puede alterar el esquema.
     * - autoLoadEntities: true → no necesito registrar manualmente cada entidad aquí:
     *      con que estén en sus módulos (TypeOrmModule.forFeature([...])) alcanza.
     * - ssl: true + extra.ssl.rejectUnauthorized=false:
     *      Permite conexiones SSL incluso con certificados no verificados
     *      (común en proveedores tipo Render/Heroku).
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      autoLoadEntities: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),

    /**
     * Módulos propios de la app:
     * - PacientesModule: endpoints y lógica de pacientes.
     * - TurnosModule: endpoints y lógica de turnos.
     */
    PacientesModule,
    TurnosModule,
  ],
  // Este módulo raíz no declara controladores ni providers propios.
  controllers: [],
  providers: [],
})
export class AppModule {}

// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// 1) "backend-gestor/src/pacientes/pacientes.module.ts"  → cómo se arma un módulo de dominio.
// 2) Luego "backend-gestor/src/turnos/turnos.module.ts"  → patrón similar aplicado a turnos.
// -----------------------------------------------------------------------------