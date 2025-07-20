import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
  ) {}

  create(createTurnoDto: CreateTurnoDto) {
    const nuevo = this.turnoRepository.create(createTurnoDto);
    return this.turnoRepository.save(nuevo);
  }

  findAll() {
    return this.turnoRepository.find({
      relations: ['paciente'],
    });
  }

  findOne(id: number) {
    return this.turnoRepository.findOne({
      where: { id },
      relations: ['paciente'],
    });
  }

  update(id: number, updateTurnoDto: UpdateTurnoDto) {
    return this.turnoRepository.update(id, updateTurnoDto);
  }

  remove(id: number) {
    return this.turnoRepository.delete(id);
  }
}