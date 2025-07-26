import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity'; // Necesitamos esto para poder asociar turnos con pacientes

import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    // Repositorio para manejar los turnos (crear, buscar, editar, borrar, etc.)
    @InjectRepository(Turno)
    private repoTurno: Repository<Turno>,

    // Repositorio de pacientes, para asegurarnos que el paciente exista antes de asignarle un turno
    @InjectRepository(Paciente)
    private repoPaciente: Repository<Paciente>,
  ) {}

  // Crea un nuevo turno en la base de datos
  async create(dto: CreateTurnoDto) {
    // Primero buscamos el paciente con el ID que vino en el DTO
    const pacienteEncontrado = await this.repoPaciente.findOneBy({ id: dto.pacienteId });

    // Si no lo encuentra, cortamos todo y lanzamos un error
    if (!pacienteEncontrado) {
      throw new Error('Paciente no encontrado');
    }

    // Creamos el objeto Turno y lo asociamos al paciente que recuperamos
    const turnoNuevo = this.repoTurno.create({
      ...dto, // Copiamos los campos (fecha, hora, razón)
      paciente: pacienteEncontrado, // Relación directa con la entidad Paciente
    });

    // Guardamos ese turno en la base
    return this.repoTurno.save(turnoNuevo);
  }

  // Devuelve todos los turnos registrados, con su respectivo paciente incluido
  findAll() {
    return this.repoTurno.find({
      relations: ['paciente'], // Trae también los datos del paciente relacionado
    });
  }

  // Devuelve un turno específico por su ID, junto con el paciente al que pertenece
  findOne(id: number) {
    return this.repoTurno.findOne({
      where: { id },
      relations: ['paciente'],
    });
  }

  // Actualiza los datos de un turno ya existente (puede cambiar fecha, hora, razón, etc.)
  update(id: number, dto: UpdateTurnoDto) {
    return this.repoTurno.update(id, dto);
  }

  // Elimina un turno por su ID
  remove(id: number) {
    return this.repoTurno.delete(id);
  }
}