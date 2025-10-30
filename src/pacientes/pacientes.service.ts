// backend-gestor/src/pacientes/pacientes.service.ts
// -----------------------------------------------------------------------------
// SERVICIO DE PACIENTES
// Acá concentro la lógica de negocio de pacientes (crear/listar/buscar/actualizar/borrar).
// El controller sólo coordina; yo uso Repository<Paciente> (TypeORM) para hablar con la DB.
// -----------------------------------------------------------------------------

// @Injectable: le digo a Nest que esta clase se puede inyectar como “herramienta”.
import { Injectable, NotFoundException } from '@nestjs/common';

// Quiero que Nest me “pase” un Repository<T> de TypeORM para mi entidad.
import { InjectRepository } from '@nestjs/typeorm';
// Repository me da métodos listos: find, findOne, save, update, delete, etc.
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// Entidad que representa la tabla "paciente" en la base.
import { Paciente } from './entities/paciente.entity';

// DTOs que validan la forma de los datos de entrada (los aplica el ValidationPipe en el controller).
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  /**
   * ¿Por qué inyecto Repository<Paciente>?
   * - Porque en el módulo declaré TypeOrmModule.forFeature([Paciente]) y eso
   *   le permite a Nest construir y “pasarme” este repositorio acá.
   */
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>,
  ) {}

  /**
   * Crear un nuevo paciente
   * Flujo que sigo:
   * 1) create(...) arma la entidad en memoria (no persiste).
   * 2) save(...) persiste en la DB y me devuelve el registro final.
   */
  create(datosPaciente: CreatePacienteDto) {
    const pacienteNuevo = this.pacienteRepo.create(datosPaciente);
    return this.pacienteRepo.save(pacienteNuevo);
  }

  /**
   * Listar todos los pacientes (con sus turnos)
   * Pido relations:['turnos'] para que ya venga la relación 1:N resuelta.
   */
  findAll() {
    return this.pacienteRepo.find({
      relations: ['turnos'],
    });
  }

  /**
   * Buscar un paciente por ID (incluye sus turnos)
   */
  findOne(id: number) {
    return this.pacienteRepo.findOne({
      where: { id },
      relations: ['turnos'],
    });
  }

  /**
   * Actualizar un paciente
   * Decisiones prácticas:
   * - Si llega "turnos" en el DTO, lo ignoro (no modifico relaciones desde acá).
   * - Uso update(id, datos) para no traer la entidad completa.
   * - Si no afectó filas, devuelvo 404 para reflejar que no existe.
   * - Devuelvo luego el paciente actualizado con sus relaciones.
   */
  async update(id: number, datosActualizados: UpdatePacienteDto) {
    // Construyo datos de actualización tipados (sin usar any)
    const soloDatos: QueryDeepPartialEntity<Paciente> = {
      ...datosActualizados,
    };

    const res = await this.pacienteRepo.update(id, soloDatos);
    if (!res.affected) throw new NotFoundException('Paciente no encontrado');

    return this.pacienteRepo.findOne({ where: { id }, relations: ['turnos'] });
  }

  /**
   * Eliminar un paciente por ID
   * Recordatorio: por onDelete:'CASCADE' en Turno, al borrar un paciente
   * también se borran sus turnos. delete(id) me devuelve cuántas filas tocó.
   */
  remove(id: number) {
    return this.pacienteRepo.delete(id);
  }
}
// ----------------------------------------------------------------------------
