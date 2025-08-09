// Servicio de Turnos
// Acá va toda la lógica "de negocio" de los turnos: crear, listar, editar, borrar.
// NOTA: guardo fecha/hora como strings validadas ('YYYY-MM-DD' y 'HH:MM').
//       No uso new Date(...) para evitar líos de zona horaria.

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    // Repositorio de Turno (tabla de turnos)
    @InjectRepository(Turno) private readonly turnosRepo: Repository<Turno>,
    // Repositorio de Paciente (para validar existencia y asignar relación)
    @InjectRepository(Paciente) private readonly pacientesRepo: Repository<Paciente>,
  ) {}

  /**
   * Crear un turno nuevo
   * - Valido que exista el paciente (404 si no).
   * - Guardo strings tal cual vienen (ya validados por el DTO).
   */
  async create(dto: CreateTurnoDto) {
    const paciente = await this.pacientesRepo.findOne({ where: { id: dto.pacienteId } });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    const turno = this.turnosRepo.create({
      fecha: dto.fecha,   // 'YYYY-MM-DD'
      hora: dto.hora,     // 'HH:MM'
      razon: dto.razon,
      paciente,
    });

    return this.turnosRepo.save(turno);
  }

  /**
   * Listar todos los turnos (con el paciente relacionado)
   * - Ordeno por fecha y hora para que sea más cómodo de ver.
   */
  findAll() {
    return this.turnosRepo.find({
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Traer un turno puntual por ID
   * - Si no existe, 404.
   */
  async findOne(id: number) {
    const turno = await this.turnosRepo.findOne({
      where: { id },
      relations: ['paciente'],
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    return turno;
  }

  /**
   * Buscar turnos de un paciente específico
   * - Usado por el endpoint: GET /patients/:id/appointments
   */
  findByPatient(pacienteId: number) {
    return this.turnosRepo.find({
      where: { paciente: { id: pacienteId } },
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Actualizar un turno
   * - Solo toco los campos que vengan en el DTO (son opcionales).
   * - Si viene pacienteId, valido que ese paciente exista y reasigno.
   */
  async update(id: number, dto: UpdateTurnoDto) {
    const turno = await this.findOne(id); // si no existe, findOne tira 404

    // Si me mandan un cambio de paciente, lo valido y reasigno
    if (dto.pacienteId !== undefined) {
      const paciente = await this.pacientesRepo.findOne({ where: { id: dto.pacienteId } });
      if (!paciente) throw new NotFoundException('Paciente no encontrado');
      turno.paciente = paciente;
    }

    // Actualizo campos simples solo si vienen
    if (dto.fecha !== undefined) turno.fecha = dto.fecha;   // 'YYYY-MM-DD'
    if (dto.hora  !== undefined) turno.hora  = dto.hora;    // 'HH:MM'
    if (dto.razon !== undefined) turno.razon = dto.razon;

    return this.turnosRepo.save(turno);
  }

  /**
   * Borrar un turno por ID
   * - Si no existe, 404 (por el findOne de arriba).
   */
  async remove(id: number) {
    const turno = await this.findOne(id);
    await this.turnosRepo.remove(turno);
    return { deleted: true, id };
  }
}
