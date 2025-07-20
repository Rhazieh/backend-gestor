import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity'; // Importamos la entidad Paciente

import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,

    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>, // Inyectamos el repositorio de Paciente
  ) {}

  // Crear nuevo turno
  async create(createTurnoDto: CreateTurnoDto) {
    // Buscamos al paciente por ID
    const paciente = await this.pacienteRepository.findOneBy({ id: createTurnoDto.pacienteId });

    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Creamos el turno y le asignamos el paciente completo
    const nuevoTurno = this.turnoRepository.create({
      ...createTurnoDto,
      paciente: paciente,
    });

    return this.turnoRepository.save(nuevoTurno);
  }

  // Obtener todos los turnos, incluyendo datos del paciente
  findAll() {
    return this.turnoRepository.find({
      relations: ['paciente'],
    });
  }

  // Obtener un turno por ID, incluyendo el paciente
  findOne(id: number) {
    return this.turnoRepository.findOne({
      where: { id },
      relations: ['paciente'],
    });
  }

  // Actualizar un turno por ID
  update(id: number, updateTurnoDto: UpdateTurnoDto) {
    return this.turnoRepository.update(id, updateTurnoDto);
  }

  // Eliminar un turno por ID
  remove(id: number) {
    return this.turnoRepository.delete(id);
  }
}