// backend-gestor/src/turnos/turnos.service.ts
// -----------------------------------------------------------------------------
// SERVICIO DE TURNOS (acá vive mi lógica de negocio)
// Me propuse centralizar todas las reglas de turnos: crear, listar, buscar,
// actualizar y eliminar. En este servicio también hago las validaciones de
// negocio que no corresponden a los DTOs: verificar existencia de paciente,
// evitar duplicados por fecha+hora y mantener consistencia al actualizar.
// Decisiones que me ayudan a defender:
//  - Guardo fecha/hora como strings validadas ('YYYY-MM-DD' / 'HH:MM') para evitar
//    líos de timezones.
//  - Me apoyo en el ValidationPipe (ver main.ts) para que Create/UpdateTurnoDto
//    ya me entreguen datos con forma y tipos correctos.
//  - Si hay colisión de fecha+hora, respondo 409 (Conflict) porque semánticamente
//    es lo correcto.
//  - En update() uso Not(id) para excluir el propio turno del chequeo de colisión.
// -----------------------------------------------------------------------------

// @Injectable: le digo a Nest que me puede “inyectar” este servicio en otros.
// Uso NotFound/Conflict para mapear reglas de negocio a HTTP limpio.
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// TypeORM: quiero inyectar repositorios y usar el operador Not para queries.
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, FindOptionsWhere } from 'typeorm';

// Entidades (tablas) involucradas
import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

// DTOs que validan/definen los datos de entrada
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    // Le pido a Nest el Repo de Turno (tabla "turno")
    @InjectRepository(Turno) private readonly turnosRepo: Repository<Turno>,
    // Y el Repo de Paciente (para verificar existencia y relacionar)
    @InjectRepository(Paciente)
    private readonly pacientesRepo: Repository<Paciente>,
  ) {}

  /**
   * Crear un turno nuevo
   * ¿Por qué este flujo?
   * 1) Primero confirmo que el paciente existe (si no, 404).
   * 2) Rechazo duplicados fecha+hora (si ya hay, 409) para evitar solapamientos.
   * 3) Recién ahí creo y guardo el turno.
   */
  async create(dto: CreateTurnoDto) {
    const paciente = await this.pacientesRepo.findOne({
      where: { id: dto.pacienteId },
    });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    // Ojo: anti-duplicado → no permito dos turnos con la misma fecha y hora
    const yaExiste = await this.turnosRepo.findOne({
      where: { fecha: dto.fecha, hora: dto.hora },
    });
    if (yaExiste) {
      throw new ConflictException('Ya existe un turno en esa fecha y hora');
    }

    // Creo la entidad en memoria y después la persisto
    const turno = this.turnosRepo.create({
      fecha: dto.fecha, // espero 'YYYY-MM-DD'
      hora: dto.hora, // espero 'HH:MM'
      razon: dto.razon,
      paciente,
    });

    return this.turnosRepo.save(turno);
  }

  /**
   * Listar todos los turnos (incluye paciente)
   * Los ordeno por fecha/hora asc para que el front los muestre natural.
   */
  findAll() {
    return this.turnosRepo.find({
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Traer un turno puntual por ID (incluye paciente).
   * Si no existe, devuelvo 404 porque es lo que espera un cliente REST.
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
   * Lo uso desde el controller de pacientes (/patients/:id/appointments).
   */
  findByPatient(pacienteId: number) {
    return this.turnosRepo.find({
      where: { paciente: { id: pacienteId } },
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Filtrar turnos por fecha (YYYY-MM-DD) y/o pacienteId.
   * Si llegan ambos, aplico AND. Si no llega ninguno, devuelvo todo.
   */
  findByFilters({
    fecha,
    pacienteId,
  }: {
    fecha?: string;
    pacienteId?: number;
  }) {
    // Si no llegan filtros, devuelvo todo
    if (!fecha && pacienteId === undefined) return this.findAll();

    const where: FindOptionsWhere<Turno> = {};
    if (fecha) where.fecha = fecha;
    if (pacienteId !== undefined) {
      // Tipo compatible con FindOptionsWhere<Turno> para relaciones
      where.paciente = { id: pacienteId } as FindOptionsWhere<Paciente>;
    }

    // Atajo: sin filtros, reuso findAll().
    return this.turnosRepo.find({
      where,
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });

    return this.turnosRepo.find({
      where,
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Actualizar un turno
   * Estrategia: actualizo sólo lo que venga en el DTO (todo opcional).
   * Si cambian paciente, verifico que exista. Si cambian fecha/hora, chequeo
   * colisiones con OTROS turnos usando Not(id).
   */
  async update(id: number, dto: UpdateTurnoDto) {
    const turno = await this.findOne(id); // si no existe, ya lanza 404

    // Reasignar a otro paciente (opcional)
    if (dto.pacienteId !== undefined) {
      const paciente = await this.pacientesRepo.findOne({
        where: { id: dto.pacienteId },
      });
      if (!paciente) throw new NotFoundException('Paciente no encontrado');
      turno.paciente = paciente;
    }

    // Tomo los valores tentativos (nuevo o actual)
    const nuevaFecha = dto.fecha ?? turno.fecha;
    const nuevaHora = dto.hora ?? turno.hora;

    // Si cambia fecha u hora, verifico colisión con OTRO turno (excluyo el mío)
    if (dto.fecha !== undefined || dto.hora !== undefined) {
      const colision = await this.turnosRepo.findOne({
        where: { fecha: nuevaFecha, hora: nuevaHora, id: Not(id) },
      });
      if (colision) {
        throw new ConflictException('Ya existe un turno en esa fecha y hora');
      }
    }

    // Actualizo sólo campos presentes en el DTO
    if (dto.fecha !== undefined) turno.fecha = dto.fecha; // espero 'YYYY-MM-DD'
    if (dto.hora !== undefined) turno.hora = dto.hora; // acepto 'HH:MM' o 'HH:MM:SS'
    if (dto.razon !== undefined) turno.razon = dto.razon;

    return this.turnosRepo.save(turno);
  }

  /**
   * Borrar un turno por ID
   * Flujo: busco (404 si no existe) → elimino → devuelvo un pequeño resumen.
   */
  async remove(id: number) {
    const turno = await this.findOne(id);
    await this.turnosRepo.remove(turno);
    return { deleted: true, id };
  }
}
// -----------------------------------------------------------------------------
