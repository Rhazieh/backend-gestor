// Módulo de Turnos
// Ajustado para:
// - Exportar TurnosService (lo usa PacientesController)
// - Importar PacientesModule con forwardRef (evita dependencia circular)
// - Mantener repos de Turno y Paciente disponibles en este módulo

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';

import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity'; // import relativo, más portable

import { PacientesModule } from '../pacientes/pacientes.module';

@Module({
  /**
   * imports:
   * - TypeOrmModule.forFeature([Turno, Paciente]): repos inyectables para este módulo
   * - forwardRef(() => PacientesModule): permite que PacientesModule nos importe y viceversa
   */
  imports: [
    TypeOrmModule.forFeature([Turno, Paciente]),
    forwardRef(() => PacientesModule),
  ],

  /**
   * controllers:
   * - TurnosController: rutas de /turnos (y luego podemos sumar alias si querés)
   */
  controllers: [TurnosController],

  /**
   * providers:
   * - TurnosService: lógica de negocio de turnos
   */
  providers: [TurnosService],

  /**
   * exports:
   * - Exporto TurnosService para que PacientesController pueda inyectarlo
   */
  exports: [TurnosService],
})
export class TurnosModule {}
