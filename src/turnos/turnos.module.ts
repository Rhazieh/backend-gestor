// backend-gestor/src/turnos/turnos.module.ts
// -----------------------------------------------------------------------------
// MÓDULO DE TURNOS
// Agrupa todo lo relacionado con Turnos:
//  - Entidad Turno (tabla y mapeo TypeORM)
//  - Servicio TurnosService (lógica de negocio)
//  - Controlador TurnosController (rutas HTTP)
//
// Puntos clave de este módulo:
// 1) Exporta TurnosService porque PacientesController lo usa para
//    /patients/:id/appointments (listar/crear turnos de un paciente).
// 2) No necesita importar PacientesModule: TurnosService usa la entidad Paciente
//    vía TypeORM (repositorio), no inyecta PacientesService.
// 3) Registra los repos de TypeORM para Turno y Paciente en este módulo.
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';

import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity'; // import relativo, más portable

// Nota: No importamos PacientesModule porque TurnosService no requiere
// inyectar PacientesService; solo usa la entidad Paciente vía TypeORM.

@Module({
  /**
   * imports:
   * - TypeOrmModule.forFeature([Turno, Paciente]):
   *     Registra los repositorios de ambas entidades dentro de este módulo,
   *     para poder inyectar Repository<Turno> y Repository<Paciente> en el servicio.
   */
  imports: [
    TypeOrmModule.forFeature([Turno, Paciente]),
  ],

  /**
   * controllers:
   * - TurnosController: define las rutas (POST/GET/PUT/PATCH/DELETE) de turnos.
   */
  controllers: [TurnosController],

  /**
   * providers:
   * - TurnosService: contiene la lógica de negocio (crear, listar, actualizar, borrar,
   *   y helpers como findByPatient).
   */
  providers: [TurnosService],

  /**
   * exports:
   * - TurnosService: lo exponemos para que otros módulos (p. ej. PacientesModule)
   *   lo puedan inyectar en sus controladores/servicios.
   */
  exports: [TurnosService],
})
export class TurnosModule {}
// ----------------------------------------------------------------------------