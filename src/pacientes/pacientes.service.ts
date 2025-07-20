import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) {}

  create(createPacienteDto: CreatePacienteDto) {
    const nuevo = this.pacienteRepository.create(createPacienteDto);
    return this.pacienteRepository.save(nuevo);
  }

  findAll() {
    return this.pacienteRepository.find({
      relations: ['turnos'], // Opcional si querés traer los turnos junto al paciente
    });
  }

  findOne(id: number) {
    return this.pacienteRepository.findOne({
      where: { id },
      relations: ['turnos'],
    });
  }

  update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return this.pacienteRepository.update(id, updatePacienteDto);
  }

  remove(id: number) {
    return this.pacienteRepository.delete(id);
  }
}