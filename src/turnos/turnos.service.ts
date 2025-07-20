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
    // Inyectamos el repositorio de Turno para poder hacer consultas, guardar, actualizar, eliminar, etc.
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,

    // También necesitamos acceder al repositorio de Paciente para vincular cada turno a un paciente existente
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) {}

  // Método para crear un nuevo turno
  async create(createTurnoDto: CreateTurnoDto) {
    // Buscamos si existe el paciente con el ID que nos pasaron
    const paciente = await this.pacienteRepository.findOneBy({ id: createTurnoDto.pacienteId });

    // Si no se encuentra el paciente, tiramos error
    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Creamos el turno y lo relacionamos con ese paciente que recuperamos
    const nuevoTurno = this.turnoRepository.create({
      ...createTurnoDto,
      paciente: paciente,
    });

    // Guardamos el nuevo turno en la base de datos
    return this.turnoRepository.save(nuevoTurno);
  }

  // Este método devuelve todos los turnos que hay en la base
  // También incluye los datos del paciente relacionado (gracias al "relations")
  findAll() {
    return this.turnoRepository.find({
      relations: ['paciente'],
    });
  }

  // Busca un turno por ID y también trae los datos del paciente
  findOne(id: number) {
    return this.turnoRepository.findOne({
      where: { id },
      relations: ['paciente'],
    });
  }

  // Actualiza un turno específico con los nuevos datos que se le pasen
  update(id: number, updateTurnoDto: UpdateTurnoDto) {
    return this.turnoRepository.update(id, updateTurnoDto);
  }

  // Borra un turno por su ID
  remove(id: number) {
    return this.turnoRepository.delete(id);
  }
}