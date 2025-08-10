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
// (rutas /patients/:id/appointments). Para eso usamos forwardRef.
// -----------------------------------------------------------------------------

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
   * - TypeOrmModule.forFeature([Paciente]):
   *     Registra el repositorio de la entidad Paciente sólo dentro de este módulo.
   *     Gracias a esto, dentro de PacientesService podemos inyectar Repository<Paciente>.
   *
   * - forwardRef(() => TurnosModule):
   *     Habilita una IMPORTACIÓN CRUZADA sin romper Nest cuando hay dependencia circular.
   *     ¿Por qué? Porque PacientesController usa TurnosService (del módulo de turnos),
   *     y a su vez TurnosModule importa PacientesModule (para la entidad Paciente,
   *     o para usar PacientesService). forwardRef difiere la resolución hasta el runtime.
   */
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    forwardRef(() => TurnosModule),
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
// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// "backend-gestor/src/pacientes/pacientes.controller.ts" → vas a ver las rutas
// en español/inglés y cómo delegan en PacientesService y TurnosService.
// -----------------------------------------------------------------------------