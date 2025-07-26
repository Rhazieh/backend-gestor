// Este archivo define el módulo de pacientes.
// Un módulo en NestJS es básicamente un "bloque" de funcionalidades relacionadas.
// Acá agrupamos todo lo que tiene que ver con pacientes: rutas, lógica y la tabla (entidad).

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PacientesService } from './pacientes.service'; // Acá va toda la lógica (crear, buscar, etc.)
import { PacientesController } from './pacientes.controller'; // Rutas HTTP que usamos para pacientes
import { Paciente } from './entities/paciente.entity'; // Es la entidad que representa la tabla "pacientes" en la DB

@Module({
  // Le decimos a Nest que este módulo va a usar la entidad Paciente con TypeORM.
  // Esto nos permite usar el repositorio dentro del servicio.
  imports: [TypeOrmModule.forFeature([Paciente])],

  // Acá registramos el controlador que maneja todas las rutas de pacientes (GET, POST, etc.)
  controllers: [PacientesController],

  // Registramos el servicio que tiene toda la lógica del backend para pacientes.
  providers: [PacientesService],
})
export class PacientesModule {} // Exportamos el módulo para poder usarlo en AppModule