import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TurnosService } from './turnos.service'; // Acá va toda la lógica para manejar los turnos
import { TurnosController } from './turnos.controller'; // Encargado de las rutas HTTP
import { Turno } from './entities/turno.entity'; // Entidad que representa la tabla "turno" en la base
import { Paciente } from 'src/pacientes/entities/paciente.entity'; // También importamos Paciente por la relación con Turno

@Module({
  // TypeORM necesita saber qué entidades se usan en este módulo.
  // Turno y Paciente están relacionadas, así que importamos las dos.
  imports: [TypeOrmModule.forFeature([Turno, Paciente])],

  // Controlador: define las rutas para manejar los turnos (GET, POST, etc)
  controllers: [TurnosController],

  // Servicio: tiene toda la lógica que usan las rutas, como crear turnos, buscarlos, etc.
  providers: [TurnosService],
})
export class TurnosModule {}