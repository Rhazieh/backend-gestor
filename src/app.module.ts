// Este archivo es el núcleo principal de la app.
// Acá conectamos todos los módulos, configuramos la base de datos y las variables de entorno.

import { Module } from '@nestjs/common'; // Permite declarar un módulo en NestJS
import { ConfigModule } from '@nestjs/config'; // Sirve para usar variables desde un archivo .env
import { TypeOrmModule } from '@nestjs/typeorm'; // Conexión con la base de datos usando TypeORM

// Importamos nuestros módulos (Pacientes y Turnos) y sus entidades
import { PacientesModule } from './pacientes/pacientes.module';
import { Paciente } from './pacientes/entities/paciente.entity';

import { TurnosModule } from './turnos/turnos.module';
import { Turno } from './turnos/entities/turno.entity';

@Module({
  imports: [
    // Activamos el módulo de variables de entorno (.env)
    // "isGlobal: true" hace que estas variables estén disponibles en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuramos la conexión a la base de datos PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Dirección del servidor (desde .env)
      port: +(process.env.DB_PORT || 5432), // Puerto (por defecto 5432 si no está definido)
      username: process.env.DB_USERNAME, // Usuario de la base de datos
      password: process.env.DB_PASSWORD, // Contraseña
      database: process.env.DB_NAME,     // Nombre de la base de datos
      entities: [Paciente, Turno],       // Entidades que usamos como tablas
      synchronize: true, // ⚠️ Solo para desarrollo. Crea o actualiza tablas automáticamente. NO usar en producción.
    }),

    // Importamos nuestros módulos personalizados
    PacientesModule,
    TurnosModule,
  ],

  // No hay controladores o servicios globales por ahora, así que los dejamos vacíos
  controllers: [],
  providers: [],
})
export class AppModule {} // Este es el módulo principal de la aplicación (el que arranca todo)