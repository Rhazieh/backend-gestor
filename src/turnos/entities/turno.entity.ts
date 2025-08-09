
// Decoradores de TypeORM para definir una entidad (tabla) y sus columnas/relaciones.
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

// Importamos la entidad Paciente para vincular cada turno con un paciente.
import { Paciente } from '../../pacientes/entities/paciente.entity';

/**
 * @Entity():
 * - Marca esta clase como una tabla en la base de datos (por defecto el nombre será "turno").
 * - Cada instancia de esta clase es una fila (registro) en esa tabla.
 */
@Entity()
export class Turno {
  /**
   * @PrimaryGeneratedColumn():
   * - Crea la columna "id" como clave primaria.
   * - Se autogenera (1, 2, 3, ...), así que no hay que asignarla a mano.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @Column():
   * - Columna para la fecha del turno.
   * - Usamos tipo Date a nivel de TypeScript/TypeORM.
   *   Ojo: aunque llegue como string desde el DTO (p. ej. "2025-08-09"),
   *   en el servicio la convertimos a Date explícitamente para evitar formatos raros.
   * - En PostgreSQL suele mapear a "timestamp without time zone" salvo que se configure distinto.
   *   Acá lo estamos usando como "solo fecha" por convención de uso en la app.
   */
  @Column()
  fecha: Date;

  /**
   * @Column():
   * - Columna para la hora del turno.
   * - Guardamos como string (ej: "14:30") porque TypeORM no tiene un tipo "solo hora" portable.
   * - Ventaja: simple y directo para mostrar/editar en el frontend.
   * - Desventaja: no permite operaciones horarias nativas en SQL sin castear.
   */
  @Column()
  hora: string;

  /**
   * @Column():
   * - Motivo o descripción breve del turno (ej: "control general").
   * - Es texto plano. Si quisieras limitar longitud, podrías usar: @Column({ length: 120 })
   */
  @Column()
  razon: string;

  /**
   * @ManyToOne():
   * - Relación muchos-a-uno: muchos turnos pueden pertenecer a un mismo paciente.
   * - El segundo argumento (paciente) => paciente.turnos conecta con el lado inverso definido en Paciente.
   * - { onDelete: 'CASCADE' }:
   *     * Si eliminás un Paciente, la base elimina automáticamente todos sus Turnos.
   *     * Útil para mantener integridad y no dejar turnos “huérfanos”.
   * - TypeORM crea la FK (por defecto "pacienteId") en esta tabla para enlazar al paciente.
   */
  @ManyToOne(() => Paciente, (paciente) => paciente.turnos, { onDelete: 'CASCADE' })
  paciente: Paciente;
}