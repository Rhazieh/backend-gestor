// Importa el decorador @Injectable para indicar que esta clase es un servicio
// y que puede ser inyectada en controladores u otros servicios.
import { Injectable } from '@nestjs/common';

// Importa el decorador para inyectar repositorios de TypeORM.
import { InjectRepository } from '@nestjs/typeorm';

// Importa el tipo Repository de TypeORM, que sirve para interactuar con una tabla específica.
import { Repository } from 'typeorm';

// Importa la entidad Turno, que representa la tabla "turnos" en la base de datos.
import { Turno } from './entities/turno.entity';

// Importa la entidad Paciente, ya que cada turno pertenece a un paciente.
import { Paciente } from '../pacientes/entities/paciente.entity';

// Importa el DTO para crear turnos.
import { CreateTurnoDto } from './dto/create-turno.dto';

// Importa el DTO para actualizar turnos.
import { UpdateTurnoDto } from './dto/update-turno.dto';

/**
 * Servicio de Turnos:
 * Aquí se concentra toda la lógica de negocio para manejar turnos:
 * creación, búsqueda, actualización y eliminación.
 */
@Injectable()
export class TurnosService {
  /**
   * Constructor con inyección de dependencias:
   * - repoTurno: repositorio para acceder a la tabla "turnos".
   * - repoPaciente: repositorio para acceder a la tabla "pacientes".
   *   Esto es necesario para asociar un turno con un paciente existente.
   */
  constructor(
    @InjectRepository(Turno)
    private repoTurno: Repository<Turno>,

    @InjectRepository(Paciente)
    private repoPaciente: Repository<Paciente>,
  ) {}

  /**
   * Crea un nuevo turno en la base de datos.
   * - dto: datos enviados desde el cliente y validados por CreateTurnoDto.
   * - Primero busca el paciente con el ID recibido.
   * - Si el paciente no existe, lanza un error.
   * - Luego crea un objeto Turno con la fecha convertida a Date,
   *   y lo asocia al paciente encontrado.
   * - Finalmente, guarda el turno en la base de datos.
   */
  async create(dto: CreateTurnoDto) {
    const pacienteEncontrado = await this.repoPaciente.findOneBy({ id: dto.pacienteId });

    if (!pacienteEncontrado) {
      throw new Error('Paciente no encontrado');
    }

    const turnoNuevo = this.repoTurno.create({
      fecha: new Date(dto.fecha), // Conversión explícita para evitar errores de formato
      hora: dto.hora,
      razon: dto.razon,
      paciente: pacienteEncontrado,
    });

    return this.repoTurno.save(turnoNuevo);
  }

  /**
   * Devuelve todos los turnos almacenados.
   * - `relations: ['paciente']` hace que también se incluya la información
   *   del paciente asociado a cada turno.
   */
  findAll() {
    return this.repoTurno.find({
      relations: ['paciente'],
    });
  }

  /**
   * Busca un turno específico por su ID.
   * - También incluye el paciente asociado.
   */
  findOne(id: number) {
    return this.repoTurno.findOne({
      where: { id },
      relations: ['paciente'],
    });
  }

  /**
   * Actualiza un turno existente.
   * - Busca el turno por ID.
   * - Si no existe, lanza un error.
   * - Si recibe una fecha, la convierte explícitamente a Date.
   * - Si recibe hora o razón, las actualiza.
   * - Guarda los cambios en la base de datos.
   */
  async update(id: number, dto: UpdateTurnoDto) {
    const turno = await this.repoTurno.findOneBy({ id });

    if (!turno) {
      throw new Error('Turno no encontrado');
    }

    if (dto.fecha) {
      turno.fecha = new Date(dto.fecha);
    }

    if (dto.hora) {
      turno.hora = dto.hora;
    }

    if (dto.razon) {
      turno.razon = dto.razon;
    }

    return this.repoTurno.save(turno);
  }

  /**
   * Elimina un turno por ID.
   * - No necesita cargar el turno completo; directamente ejecuta la eliminación.
   */
  remove(id: number) {
    return this.repoTurno.delete(id);
  }
}