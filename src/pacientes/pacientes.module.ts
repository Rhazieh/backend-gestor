// backend-gestor/src/pacientes/pacientes.module.ts
// -----------------------------------------------------------------------------
// MÓDULO DE PACIENTES
// Este módulo “empaqueta” todo lo relacionado con Pacientes:
// - Entidad (Paciente) para la base de datos
// - Servicio (PacientesService) con la lógica de negocio
// - Controlador (PacientesController) con las rutas HTTP
//
// Además, IMPORTA el módulo de Turnos porque el controller de pacientes
// usa TurnosService para listar/crear turnos de un paciente
// (rutas /patients/:id/appointments). No hay dependencia circular de servicios,
// por eso la importación es directa.
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Paciente } from './entities/paciente.entity';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

// Importo el módulo de turnos para poder inyectar TurnosService en el controller.
import { TurnosModule } from '../turnos/turnos.module';

@Module({
  /**
   * imports:
   * - TypeOrmModule.forFeature([Paciente]):
   *     Registra el repositorio de la entidad Paciente sólo dentro de este módulo.
   *     Gracias a esto, dentro de PacientesService podemos inyectar Repository<Paciente>.
   *
  * - TurnosModule:
  *     Importación directa para poder inyectar TurnosService en el controller.
  *     No existe inyección inversa de PacientesService en TurnosService, por lo que
  *     no se necesita forwardRef.
   */
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    TurnosModule,
  ],

  /**
   * controllers:
   * - PacientesController:
   *     Expone rutas en español e inglés (['/pacientes', '/patients']) y
   *     también maneja /patients/:id/appointments (GET/POST) delegando en TurnosService.
   */
  controllers: [PacientesController],

  /**
   * providers:
   * - PacientesService:
   *     Lógica de negocio de pacientes (CRUD, validaciones simples, etc.).
   */
  providers: [PacientesService],

  /**
   * exports:
   * - PacientesService:
   *     Lo exportamos por si TurnosModule (u otro módulo) necesita inyectarlo.
   *     Exportar servicios evita problemas cuando hay imports cruzados.
   */
  exports: [PacientesService],
})
export class PacientesModule {}
// ----------------------------------------------------------------------------