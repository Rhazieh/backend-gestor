// Importa el decorador @Module para definir un módulo en NestJS.
import { Module } from '@nestjs/common';

// Importa TypeOrmModule para poder trabajar con la base de datos usando TypeORM.
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa el servicio de turnos, donde estará toda la lógica de negocio
// (crear, buscar, actualizar y eliminar turnos).
import { TurnosService } from './turnos.service';

// Importa el controlador de turnos, que maneja las rutas HTTP.
import { TurnosController } from './turnos.controller';

// Importa la entidad Turno, que representa la tabla "turnos" en la base de datos.
import { Turno } from './entities/turno.entity';

// Importa la entidad Paciente porque hay una relación entre turnos y pacientes
// (cada turno pertenece a un paciente).
import { Paciente } from 'src/pacientes/entities/paciente.entity';

/**
 * Módulo de Turnos:
 * - Agrupa el controlador, el servicio y las entidades relacionadas con turnos.
 * - Permite manejar las operaciones CRUD de los turnos y su relación con pacientes.
 */
@Module({
  /**
   * imports:
   * - TypeOrmModule.forFeature([Turno, Paciente]):
   *   Registra las entidades Turno y Paciente en este módulo para que TypeORM
   *   pueda inyectar sus repositorios.
   *   Esto es necesario porque un turno está relacionado con un paciente y,
   *   en algunas operaciones, se necesita acceder a la información del paciente.
   */
  imports: [TypeOrmModule.forFeature([Turno, Paciente])],

  /**
   * controllers:
   * - Lista de controladores que manejan las rutas de este módulo.
   *   TurnosController define las rutas como GET, POST, PATCH, DELETE para turnos.
   */
  controllers: [TurnosController],

  /**
   * providers:
   * - Lista de servicios (y otras dependencias) que este módulo necesita.
   *   TurnosService contiene la lógica para crear, buscar, actualizar y eliminar turnos.
   */
  providers: [TurnosService],
})
// Exportamos el módulo para que pueda ser usado en AppModule.
export class TurnosModule {}