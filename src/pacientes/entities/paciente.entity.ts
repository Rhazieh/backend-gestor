// backend-gestor/src/pacientes/entities/paciente.entity.ts
// -----------------------------------------------------------------------------
// ENTIDAD "PACIENTE" (TypeORM)
// Acá defino cómo quiero que TypeORM mapee mi clase a la tabla de la DB.
// ¿Por qué? Porque quiero tener tipado en TypeScript y a la vez controlar
// columnas/relaciones desde el código. Relación clave: 1 Paciente → muchos Turnos.
// -----------------------------------------------------------------------------

// Uso estos decoradores como “etiquetas” para que TypeORM sepa crear columnas/relaciones.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';

// Importo Turno para declarar la relación 1:N (Paciente → Turnos).
import { Turno } from '../../turnos/entities/turno.entity';

/**
 * @Entity(): “etiqueta” que marca esta clase como tabla.
 * Nota para mí: si no paso nombre, usa el de la clase (ej. paciente).
 */
@Entity()
@Unique(['email'])
export class Paciente {
  /**
   * @PrimaryGeneratedColumn(): quiero un id autoincremental como PK.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @Column(): columna simple de texto para el nombre.
   */
  @Column()
  nombre: string;

  /**
   * @Column(): email como texto. Validación de formato la hago en el DTO.
   */
  @Column()
  email: string;

  /**
   * @Column(): teléfono como texto (acepto distintos formatos).
   */
  @Column()
  telefono: string;

  /**
   * @OneToMany(() => Turno, (turno) => turno.paciente)
   * ¿Por qué así? Porque el dueño de la FK es Turno (ManyToOne). Acá solo
   * defino el lado inverso para poder pedir relations:['turnos'] y que TypeORM
   * me traiga el array de Turno[] asociado.
   * Importante: el onDelete:'CASCADE' lo configuré en Turno (lado ManyToOne).
   */
  @OneToMany(() => Turno, (turno) => turno.paciente)
  turnos: Turno[];
}
// ----------------------------------------------------------------------------
