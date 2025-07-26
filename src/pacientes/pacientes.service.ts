// Acá va toda la lógica que se encarga de manejar los pacientes.
// Es decir: crear, buscar, actualizar y eliminar pacientes.
// Para eso usamos un "repositorio" que se conecta a la base con TypeORM.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  // Acá se inyecta el repositorio de la entidad Paciente.
  // Eso nos da acceso a métodos como .find(), .create(), .update(), .delete(), etc.
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>, // Le cambié el nombre a "pacienteRepo" para que no se confunda con los métodos
  ) {}

  // Crea un nuevo paciente en la base.
  // Primero arma el objeto (sin guardarlo aún), y después lo guarda con save().
  create(datosPaciente: CreatePacienteDto) {
    const pacienteNuevo = this.pacienteRepo.create(datosPaciente);
    return this.pacienteRepo.save(pacienteNuevo);
  }

  // Devuelve todos los pacientes registrados en la base.
  // Además, trae también los turnos de cada paciente si tienen (por eso usamos "relations").
  findAll() {
    return this.pacienteRepo.find({
      relations: ['turnos'],
    });
  }

  // Busca un solo paciente por su ID.
  // También incluye los turnos que tenga ese paciente.
  findOne(id: number) {
    return this.pacienteRepo.findOne({
      where: { id },
      relations: ['turnos'],
    });
  }

  // Actualiza un paciente según el ID y los nuevos datos recibidos.
  update(id: number, datosActualizados: UpdatePacienteDto) {
    return this.pacienteRepo.update(id, datosActualizados);
  }

  // Elimina un paciente por ID.
  // Si ese paciente tiene turnos, también se borran automáticamente (por la cascada definida en la entidad).
  remove(id: number) {
    return this.pacienteRepo.delete(id);
  }
}