// Este archivo es el corazón de la app, donde se conectan todos los módulos y se configura lo más importante

import { Module } from '@nestjs/common'; // Decorador para declarar un módulo en Nest
import { ConfigModule } from '@nestjs/config'; // Permite usar variables de entorno (como el .env)
import { TypeOrmModule } from '@nestjs/typeorm'; // Conecta Nest con la base de datos usando TypeORM

// Acá importamos los módulos propios que armamos (Pacientes y Turnos) y sus entidades
import { PacientesModule } from './pacientes/pacientes.module';
import { Paciente } from './pacientes/entities/paciente.entity';

import { TurnosModule } from './turnos/turnos.module';
import { Turno } from './turnos/entities/turno.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que las variables de entorno estén disponibles en toda la app sin importar dónde estés
    }),
    TypeOrmModule.forRoot({
      // Acá configuramos cómo nos conectamos a la base de datos PostgreSQL
      type: 'postgres', // Tipo de base de datos
      host: process.env.DB_HOST, // El host viene desde el archivo .env
      port: +(process.env.DB_PORT || 5432), // Puerto, por defecto 5432 si no está definido
      username: process.env.DB_USERNAME, // Usuario para conectar
      password: process.env.DB_PASSWORD, // Contraseña
      database: process.env.DB_NAME, // Nombre de la base
      entities: [Paciente, Turno], // Le decimos qué entidades (tablas) usamos
      synchronize: true, // OJO: esto sincroniza la base cada vez que iniciás. Útil en desarrollo, pero peligroso en producción.
    }),
    PacientesModule, // Importamos el módulo de Pacientes (que ya tiene su service/controller/entidad)
    TurnosModule,    // Lo mismo con el módulo de Turnos
  ],
  controllers: [], // Acá irían controladores globales, pero en este caso no hay
  providers: [],   // Servicios globales (tampoco hay por ahora)
})
export class AppModule {} // Este es el módulo raíz de toda la aplicación