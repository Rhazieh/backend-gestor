// backend-gestor/src/turnos/turnos.service.ts
// -----------------------------------------------------------------------------
// SERVICIO DE TURNOS (lógica de negocio, acceso a DB con TypeORM)
// Acá centralizamos todo lo de Turnos:
//  - crear turnos (validando paciente y evitando choques de fecha+hora)
//  - listar turnos (con su paciente y ordenados)
//  - buscar por id / por paciente
//  - actualizar (con validaciones y anti-duplicados)
//  - eliminar
//
// Detalles clave:
//  • Guardamos fecha/hora como STRINGS validadas por DTOs ('YYYY-MM-DD' y 'HH:MM')
//    para evitar problemas de zonas horarias.
//  • ValidationPipe global (ver main.ts) aplica reglas de Create/UpdateTurnoDto.
//  • Usamos ConflictException (409) si ya existe un turno en la misma fecha+hora.
//  • En update() usamos Not(id) para buscar colisiones EXCLUYENDO el turno actual.
// -----------------------------------------------------------------------------

// NestJS: Injectable para servicios, NotFound/Conflict para errores HTTP acordes.
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// TypeORM: inyección de repos, y operador Not para consultas.
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

// Entidades (tablas) involucradas
import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

// DTOs (validan/definen los datos de entrada)
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    // Repo de Turno (tabla "turno")
    @InjectRepository(Turno) private readonly turnosRepo: Repository<Turno>,
    // Repo de Paciente (para verificar existencia y relacionar)
    @InjectRepository(Paciente) private readonly pacientesRepo: Repository<Paciente>,
  ) {}

  /**
   * Crear un turno nuevo
   * Flujo:
   * 1) Verificar que el paciente existe (404 si no).
   * 2) Evitar duplicados de fecha+hora (409 si ya hay uno).
   * 3) Crear y guardar el turno (fecha/hora vienen como strings validadas).
   */
  async create(dto: CreateTurnoDto) {
    const paciente = await this.pacientesRepo.findOne({ where: { id: dto.pacienteId } });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    // ❗ Anti-duplicado: no permitimos dos turnos con misma fecha y hora
    const yaExiste = await this.turnosRepo.findOne({
      where: { fecha: dto.fecha, hora: dto.hora },
    });
    if (yaExiste) {
      throw new ConflictException('Ya existe un turno en esa fecha y hora');
    }

    // Creamos la entidad en memoria y luego la persistimos
    const turno = this.turnosRepo.create({
      fecha: dto.fecha,   // 'YYYY-MM-DD'
      hora: dto.hora,     // 'HH:MM'
      razon: dto.razon,
      paciente,
    });

    return this.turnosRepo.save(turno);
  }

  /**
   * Listar todos los turnos (con el paciente relacionado)
   * - Ordenados por fecha y hora ascendente para visualización cómoda.
   */
  findAll() {
    return this.turnosRepo.find({
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Traer un turno puntual por ID (incluye paciente).
   * - Si no existe, NotFound (404).
   */
  async findOne(id: number) {
    const turno = await this.turnosRepo.findOne({
      where: { id },
      relations: ['paciente'],
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    return turno;
  }

  /**
   * Buscar turnos de un paciente específico
   * - Utilizado por GET /patients/:id/appointments (alias en el controller de pacientes).
   */
  findByPatient(pacienteId: number) {
    return this.turnosRepo.find({
      where: { paciente: { id: pacienteId } },
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Actualizar un turno
   * - Solo modificamos lo que venga en el DTO (todos los campos son opcionales).
   * - Si piden cambiar el paciente, verificamos que exista.
   * - Si cambian fecha u hora, validamos que no colisione con OTRO turno
   *   (usamos Not(id) para excluir el mismo turno del chequeo).
   */
  async update(id: number, dto: UpdateTurnoDto) {
    const turno = await this.findOne(id); // si no existe, ya lanza 404

    // Reasignar a otro paciente (opcional)
    if (dto.pacienteId !== undefined) {
      const paciente = await this.pacientesRepo.findOne({ where: { id: dto.pacienteId } });
      if (!paciente) throw new NotFoundException('Paciente no encontrado');
      turno.paciente = paciente;
    }

    // Tomamos los “nuevos” valores tentativos
    const nuevaFecha = dto.fecha ?? turno.fecha;
    const nuevaHora  = dto.hora  ?? turno.hora;

    // Si cambia fecha u hora, verificamos colisión con OTRO turno
    if (dto.fecha !== undefined || dto.hora !== undefined) {
      const colision = await this.turnosRepo.findOne({
        where: { fecha: nuevaFecha, hora: nuevaHora, id: Not(id) },
      });
      if (colision) {
        throw new ConflictException('Ya existe un turno en esa fecha y hora');
      }
    }

    // Actualizamos sólo campos presentes en el DTO
    if (dto.fecha !== undefined) turno.fecha = dto.fecha;   // 'YYYY-MM-DD'
    if (dto.hora  !== undefined) turno.hora  = dto.hora;    // 'HH:MM'
    if (dto.razon !== undefined) turno.razon = dto.razon;

    return this.turnosRepo.save(turno);
  }

  /**
   * Borrar un turno por ID
   * - Primero lo buscamos (404 si no existe), luego lo eliminamos.
   */
  async remove(id: number) {
    const turno = await this.findOne(id);
    await this.turnosRepo.remove(turno);
    return { deleted: true, id };
  }
}
// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// "backend-gestor/src/turnos/dto/create-turno.dto.ts"
// → validaciones de entrada para crear (fecha/hora/razón/pacienteId).
// -----------------------------------------------------------------------------