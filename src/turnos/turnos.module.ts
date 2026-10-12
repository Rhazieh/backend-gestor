// backend-gestor/src/turnos/turnos.module.ts
// -----------------------------------------------------------------------------
// MÓDULO DE TURNOS
// Acá empaqueto todo lo de Turnos: entidad, servicio y controller.
// Decisión de diseño: exporto TurnosService porque lo voy a usar desde
// PacientesController para los endpoints anidados (/patients/:id/appointments).
// No necesito importar PacientesModule porque el servicio usa directamente
// el repositorio de Paciente vía TypeORM (no inyecto PacientesService).
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';

import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity'; // uso import relativo para portabilidad

// Recordatorio: no importo PacientesModule; solo necesito la entidad Paciente.

@Module({
  /**
   * imports (por qué): registro los repositorios de Turno y Paciente para
   * que Nest me los pueda “pasar” (inyección) en el servicio.
   */
  imports: [TypeOrmModule.forFeature([Turno, Paciente])],

  /**
   * controllers: TurnosController → define las rutas (POST/GET/PUT/PATCH/DELETE).
   */
  controllers: [TurnosController],

  /**
   * providers: TurnosService → concentro acá la lógica para mantener el controller simple.
   */
  providers: [TurnosService],

  /**
   * exports: TurnosService → lo expongo para reusarlo desde PacientesModule.
   */
  exports: [TurnosService],
})
export class TurnosModule {}
// ----------------------------------------------------------------------------
