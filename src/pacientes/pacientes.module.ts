// Este archivo define el "módulo" de pacientes.
// En NestJS, un módulo sirve para agrupar todo lo relacionado a una parte del sistema.
// En este caso, todo lo de pacientes: controlador, servicio, entidad, etc.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PacientesService } from './pacientes.service'; // Lógica de negocio
import { PacientesController } from './pacientes.controller'; // Rutas HTTP
import { Paciente } from './entities/paciente.entity'; // Representación de la tabla Paciente

@Module({
  // Acá le indicamos a Nest que vamos a trabajar con la entidad Paciente usando TypeORM.
  // Esto nos permite inyectar el repositorio en el servicio.
  imports: [TypeOrmModule.forFeature([Paciente])],

  // Controlador con todas las rutas que permiten interactuar con pacientes (GET, POST, etc).
  controllers: [PacientesController],

  // Servicio que contiene toda la lógica que se usa desde el controlador.
  providers: [PacientesService],
})
export class PacientesModule {}