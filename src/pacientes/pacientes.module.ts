// Módulo de Pacientes
// Ahora importa también el módulo de Turnos porque el controller
// usa TurnosService para listar/crear appointments del paciente.

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Paciente } from './entities/paciente.entity';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

// Importo el módulo de turnos para poder inyectar TurnosService en el controller.
// Uso forwardRef por si TurnosModule, a su vez, importa PacientesModule (dependencia circular).
import { TurnosModule } from '../turnos/turnos.module';

@Module({
  /**
   * imports:
   * - TypeOrmModule.forFeature([Paciente]): repo de Paciente para este módulo
   * - forwardRef(() => TurnosModule): habilita usar TurnosService en el controller
   */
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    forwardRef(() => TurnosModule),
  ],

  /**
   * controllers:
   * - PacientesController ahora atiende /pacientes y /patients
   *   y además /patients/:id/appointments (GET/POST)
   */
  controllers: [PacientesController],

  /**
   * providers:
   * - Lógica de negocio de pacientes
   */
  providers: [PacientesService],

  /**
   * exports:
   * - Exporto PacientesService por si TurnosModule (u otros) lo necesitan.
   *   No duele y evita problemas en casos de imports cruzados.
   */
  exports: [PacientesService],
})
export class PacientesModule {}
