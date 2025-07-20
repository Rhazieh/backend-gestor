import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Turno } from './entities/turno.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

// Este módulo junta todo lo que tiene que ver con "Turnos": el controlador, el servicio
// y las entidades necesarias (Turno y Paciente). 
// Gracias a esto, Nest sabe cómo inyectar y trabajar con estos elementos.

@Module({
  // Acá le decimos a TypeORM que vamos a trabajar con estas entidades en este módulo.
  // Es necesario importar tanto Turno como Paciente porque Turno está relacionado con Paciente.
  imports: [TypeOrmModule.forFeature([Turno, Paciente])],
  
  // El controlador maneja las rutas HTTP
  controllers: [TurnosController],

  // El servicio se encarga de la lógica del negocio (crear, buscar, actualizar, eliminar turnos)
  providers: [TurnosService],
})
export class TurnosModule {}