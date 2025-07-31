import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private repoTurno: Repository<Turno>,

    @InjectRepository(Paciente)
    private repoPaciente: Repository<Paciente>,
  ) {}

  async create(dto: CreateTurnoDto) {
    const pacienteEncontrado = await this.repoPaciente.findOneBy({ id: dto.pacienteId });

    if (!pacienteEncontrado) {
      throw new Error('Paciente no encontrado');
    }

    const turnoNuevo = this.repoTurno.create({
      fecha: new Date(dto.fecha), // 👈 Convertimos explícitamente acá también
      hora: dto.hora,
      razon: dto.razon,
      paciente: pacienteEncontrado,
    });

    return this.repoTurno.save(turnoNuevo);
  }

  findAll() {
    return this.repoTurno.find({
      relations: ['paciente'],
    });
  }

  findOne(id: number) {
    return this.repoTurno.findOne({
      where: { id },
      relations: ['paciente'],
    });
  }

  async update(id: number, dto: UpdateTurnoDto) {
    const turno = await this.repoTurno.findOneBy({ id });

    if (!turno) {
      throw new Error('Turno no encontrado');
    }

    // Corrección clara del error:
    if (dto.fecha) {
      turno.fecha = new Date(dto.fecha); // 👈 Conversión explícita
    }

    if (dto.hora) {
      turno.hora = dto.hora;
    }

    if (dto.razon) {
      turno.razon = dto.razon;
    }

    return this.repoTurno.save(turno);
  }

  remove(id: number) {
    return this.repoTurno.delete(id);
  }
}
