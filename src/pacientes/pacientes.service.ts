// Este servicio contiene toda la lógica que maneja la entidad Paciente.
// Acá usamos el repositorio de TypeORM para interactuar con la base de datos.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  // Inyectamos el repositorio de la entidad Paciente.
  // Esto nos permite usar métodos como .save(), .find(), .delete(), etc.
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) {}

  // Crea un nuevo paciente en la base de datos.
  // Primero usa .create() para generar el objeto y luego .save() para guardarlo realmente.
  create(createPacienteDto: CreatePacienteDto) {
    const nuevo = this.pacienteRepository.create(createPacienteDto);
    return this.pacienteRepository.save(nuevo);
  }

  // Trae todos los pacientes registrados.
  // Además, con la opción "relations" también trae los turnos vinculados a cada paciente (si los tiene).
  findAll() {
    return this.pacienteRepository.find({
      relations: ['turnos'], // Esto hace que venga cada paciente con su lista de turnos
    });
  }

  // Busca un paciente específico por su ID.
  // También trae los turnos que tenga ese paciente (por eso usamos relations).
  findOne(id: number) {
    return this.pacienteRepository.findOne({
      where: { id },
      relations: ['turnos'],
    });
  }

  // Actualiza los datos de un paciente, usando su ID.
  // Los cambios vienen en el DTO de actualización.
  update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return this.pacienteRepository.update(id, updatePacienteDto);
  }

  // Elimina un paciente de la base de datos según su ID.
  // Si ese paciente tiene turnos, se eliminan en cascada (lo definimos en la entidad).
  remove(id: number) {
    return this.pacienteRepository.delete(id);
  }
}