// Importa el decorador @Injectable, que marca esta clase como un servicio en NestJS.
// Los servicios son donde se concentra la lógica de negocio.
import { Injectable } from '@nestjs/common';

// Importa la función para inyectar un repositorio de TypeORM en un servicio.
import { InjectRepository } from '@nestjs/typeorm';

// Importa el tipo Repository de TypeORM, que representa una "puerta de entrada"
// a la base de datos para una entidad específica.
import { Repository } from 'typeorm';

// Importa la entidad Paciente, que representa la tabla "pacientes" en la base de datos.
import { Paciente } from './entities/paciente.entity';

// Importa el DTO que define y valida los datos necesarios para crear un paciente.
import { CreatePacienteDto } from './dto/create-paciente.dto';

// Importa el DTO para actualizar un paciente con datos parciales.
import { UpdatePacienteDto } from './dto/update-paciente.dto';

// Marca la clase como un servicio inyectable en otros componentes (como controladores).
@Injectable()
export class PacientesService {
  /**
   * Constructor con inyección de dependencias:
   * - @InjectRepository(Paciente) le dice a NestJS que nos inyecte un repositorio
   *   que trabaja específicamente con la entidad Paciente.
   * - pacienteRepo nos permite acceder a métodos listos para interactuar con la DB:
   *   find, findOne, save, update, delete, etc.
   */
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>,
  ) {}

  /**
   * Crea un nuevo paciente en la base de datos.
   * - Recibe un objeto con los datos validados (CreatePacienteDto).
   * - `create()` construye una instancia de Paciente, pero no la guarda todavía.
   * - `save()` guarda el objeto en la base y devuelve el registro ya almacenado.
   */
  create(datosPaciente: CreatePacienteDto) {
    const pacienteNuevo = this.pacienteRepo.create(datosPaciente);
    return this.pacienteRepo.save(pacienteNuevo);
  }

  /**
   * Devuelve todos los pacientes guardados en la base de datos.
   * - La opción `relations: ['turnos']` hace que también se traigan
   *   todos los turnos asociados a cada paciente (relación 1:N).
   */
  findAll() {
    return this.pacienteRepo.find({
      relations: ['turnos'],
    });
  }

  /**
   * Busca un solo paciente por su ID.
   * - También incluye los turnos asociados gracias a `relations`.
   * - `where: { id }` es equivalente a un "WHERE id = ..." en SQL.
   */
  findOne(id: number) {
    return this.pacienteRepo.findOne({
      where: { id },
      relations: ['turnos'],
    });
  }

  /**
   * Actualiza un paciente existente por ID.
   * - Recibe datos parciales (UpdatePacienteDto).
   * - Se crea una copia (`soloDatos`) y se elimina la propiedad `turnos`
   *   para evitar que se intente modificar la relación directamente aquí.
   * - `update()` aplica los cambios sin traer toda la entidad.
   * - Luego hacemos un `findOne()` para devolver el registro ya actualizado.
   */
  async update(id: number, datosActualizados: UpdatePacienteDto) {
    const soloDatos = { ...datosActualizados } as any;
    delete soloDatos.turnos;

    await this.pacienteRepo.update(id, soloDatos);
    return this.pacienteRepo.findOne({ where: { id }, relations: ['turnos'] });
  }

  /**
   * Elimina un paciente por ID.
   * - Si en la entidad Paciente está configurada la opción "cascade" en la relación con turnos,
   *   entonces también se eliminarán sus turnos automáticamente.
   */
  remove(id: number) {
    return this.pacienteRepo.delete(id);
  }
}