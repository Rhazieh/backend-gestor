// backend-gestor/src/pacientes/pacientes.module.ts
// -----------------------------------------------------------------------------
// MÓDULO DE PACIENTES
// Acá agrupo “todo lo de pacientes” en un solo lugar: entidad, servicio y
// controller. Decidí importar también TurnosModule porque mi controller de
// pacientes usa TurnosService para armar endpoints tipo
// /patients/:id/appointments. No hay dependencia circular de servicios,
// así que la importación es directa y limpia.
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Paciente } from './entities/paciente.entity';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

// Importo TurnosModule porque quiero inyectar TurnosService en mi controller.
import { TurnosModule } from '../turnos/turnos.module';

@Module({
  /**
   * imports (¿por qué estos?):
   * - TypeOrmModule.forFeature([Paciente]) → quiero que Nest me “pase”
   *   el Repository<Paciente> SOLO dentro de este módulo (service/controller).
   * - TurnosModule → necesito TurnosService en el controller (endpoints anidados).
   *   Como no hay inyección inversa, no hace falta un forwardRef.
   */
  imports: [TypeOrmModule.forFeature([Paciente]), TurnosModule],

  /**
   * controllers:
   * - PacientesController → define rutas en español e inglés (['/pacientes', '/patients'])
   *   y resuelve /patients/:id/appointments delegando en TurnosService.
   */
  controllers: [PacientesController],

  /**
   * providers:
   * - PacientesService → guardo acá la lógica (CRUD y reglas) para mantener el controller liviano.
   */
  providers: [PacientesService],

  /**
   * exports:
   * - PacientesService → lo dejo disponible por si otro módulo necesita consumirlo.
   */
  exports: [PacientesService],
})
export class PacientesModule {}
// ----------------------------------------------------------------------------
