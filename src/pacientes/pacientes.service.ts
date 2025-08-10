// backend-gestor/src/pacientes/pacientes.service.ts
// -----------------------------------------------------------------------------
// SERVICIO DE PACIENTES (NestJS + TypeORM)
// Acá vive la lógica de negocio de "pacientes": crear, listar, buscar, actualizar y borrar.
// El controller NO toca la base directamente: delega todo en este servicio.
// -----------------------------------------------------------------------------

// @Injectable permite que Nest cree e inyecte esta clase donde se necesite.
import { Injectable, NotFoundException } from '@nestjs/common';

// InjectRepository inyecta un Repository<T> de TypeORM para nuestra entidad.
import { InjectRepository } from '@nestjs/typeorm';
// Repository ofrece métodos listos: find, findOne, save, update, delete, etc.
import { Repository } from 'typeorm';

// Entidad que representa la tabla "paciente" en la base.
import { Paciente } from './entities/paciente.entity';

// DTOs que validan la forma de los datos de entrada.
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  /**
   * Inyección del repositorio de Paciente:
   * - Gracias a TypeOrmModule.forFeature([Paciente]) en el módulo,
   *   Nest sabe cómo construir este Repository<Paciente>.
   */
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>,
  ) {}

  /**
   * Crea un nuevo paciente.
   * Flujo:
   * 1) this.pacienteRepo.create(...) → arma la entidad en memoria (no guarda).
   * 2) this.pacienteRepo.save(...)   → inserta/actualiza en la DB y devuelve el registro final.
   */
  create(datosPaciente: CreatePacienteDto) {
    const pacienteNuevo = this.pacienteRepo.create(datosPaciente);
    return this.pacienteRepo.save(pacienteNuevo);
  }

  /**
   * Trae TODOS los pacientes.
   * - relations: ['turnos'] → además de los datos del paciente,
   *   carga la relación 1:N con sus turnos (definida en la entidad).
   */
  findAll() {
    return this.pacienteRepo.find({
      relations: ['turnos'],
    });
  }

  /**
   * Busca un paciente por ID.
   * - where: { id } → equivalente a "WHERE id = ?".
   * - relations: ['turnos'] → incluye sus turnos.
   */
  findOne(id: number) {
    return this.pacienteRepo.findOne({
      where: { id },
      relations: ['turnos'],
    });
  }

  /**
   * Actualiza parcialmente un paciente.
   * Tips:
   * - Hacemos una copia del DTO y removemos "turnos" (si viniera) para
   *   evitar modificar la relación desde acá.
   * - update(id, datos) actualiza sin traer la entidad completa.
   * - Si no afectó ninguna fila, tiramos NotFoundException (404).
   * - Luego devolvemos el paciente ya actualizado con sus relaciones.
   */
  async update(id: number, datosActualizados: UpdatePacienteDto) {
    const soloDatos = { ...datosActualizados } as any;
    delete soloDatos.turnos;

    const res = await this.pacienteRepo.update(id, soloDatos);
    if (!res.affected) throw new NotFoundException('Paciente no encontrado');

    return this.pacienteRepo.findOne({ where: { id }, relations: ['turnos'] });
  }

  /**
   * Elimina un paciente por ID.
   * - Si la relación Turno → Paciente tiene onDelete: 'CASCADE',
   *   al borrar un paciente también se borran sus turnos.
   * - delete(id) devuelve info de cuántas filas se afectaron.
   */
  remove(id: number) {
    return this.pacienteRepo.delete(id);
  }
}
// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// "backend-gestor/src/pacientes/entities/paciente.entity.ts"
// → para ver cómo está definida la tabla/relación con Turno.
// Luego mirá "backend-gestor/src/turnos/turnos.service.ts" para entender
// el otro lado de la relación (crear/listar turnos por paciente).
// -----------------------------------------------------------------------------