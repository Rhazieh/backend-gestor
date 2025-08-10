// backend-gestor/src/app.module.ts

// Importa el decorador @Module, que sirve para definir un módulo en NestJS.
// Un módulo es como una "caja" que agrupa controladores, servicios y configuraciones relacionados.
import { Module } from '@nestjs/common';

// Importa el módulo de configuración, que permite usar variables de entorno (.env) en la aplicación.
import { ConfigModule } from '@nestjs/config';

// Importa el módulo TypeORM, que es el ORM (Object Relational Mapper) para conectarnos a la base de datos.
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa los módulos personalizados de nuestra app.
// Cada uno maneja una parte específica: pacientes y turnos.
import { PacientesModule } from './pacientes/pacientes.module';
import { TurnosModule } from './turnos/turnos.module';

// El decorador @Module define la configuración principal de este módulo raíz.
@Module({
  imports: [
    /**
     * ConfigModule.forRoot():
     * - Carga las variables de entorno desde el archivo .env (si existe).
     * - `isGlobal: true` significa que este módulo estará disponible en toda la app
     *   sin necesidad de importarlo en cada módulo.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * Configuración de la conexión a la base de datos usando TypeORM.
     * Aquí le decimos:
     * - `type: 'postgres'`: Usaremos PostgreSQL como motor de base de datos.
     * - `url: process.env.DATABASE_URL`: Dirección completa de conexión,
     *    tomada de una variable de entorno (ej. usuario, contraseña, host, puerto, base de datos).
     * - `synchronize: true`: Sincroniza automáticamente las entidades con la base de datos
     *    (útil en desarrollo, pero peligroso en producción porque puede borrar datos).
     * - `autoLoadEntities: true`: Carga automáticamente todas las entidades registradas en cualquier módulo.
     * - `ssl: true` y configuración extra:
     *    * Se usa para conexiones seguras (importante en hosting como Render/Heroku).
     *    * `rejectUnauthorized: false` permite aceptar certificados no verificados,
     *      útil cuando el proveedor usa certificados auto-firmados.
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
     * Importamos nuestros módulos personalizados:
     * - PacientesModule: Maneja todo lo relacionado con pacientes.
     * - TurnosModule: Maneja todo lo relacionado con turnos.
     */
    PacientesModule,
    TurnosModule,
  ],
  // En este módulo raíz no registramos controladores ni proveedores directamente.
  controllers: [],
  providers: [],
})
// Exportamos la clase AppModule para que NestJS pueda usarla como módulo raíz.
export class AppModule {}