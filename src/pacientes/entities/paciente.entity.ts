// Importamos decoradores de TypeORM para definir una entidad y sus columnas.
// - @Entity: Marca la clase como una tabla en la base de datos.
// - @PrimaryGeneratedColumn: Define una columna que es clave primaria y autoincremental.
// - @Column: Define una columna normal.
// - @OneToMany: Define una relación uno-a-muchos con otra entidad.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// Importa la entidad Turno para poder establecer la relación 1:N.
// Esto indica que un paciente puede tener varios turnos asociados.
import { Turno } from '../../turnos/entities/turno.entity';

/**
 * La clase Paciente representa una tabla en la base de datos llamada "paciente".
 * Cada propiedad decorada con @Column (o similar) es una columna en esa tabla.
 * TypeORM se encarga de convertir esta clase en una tabla real.
 */
@Entity()
export class Paciente {
  /**
   * @PrimaryGeneratedColumn:
   * - Crea una columna llamada "id".
   * - Es clave primaria (Primary Key).
   * - Es autoincremental: cada nuevo paciente recibe un ID único automáticamente.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @Column():
   * - Crea una columna para almacenar el nombre del paciente.
   * - Por defecto, es de tipo texto (VARCHAR en SQL).
   */
  @Column()
  nombre: string;

  /**
   * @Column():
   * - Crea una columna para almacenar el email del paciente.
   * - No tiene validación aquí, pero podría validarse en un DTO.
   */
  @Column()
  email: string;

  /**
   * @Column():
   * - Crea una columna para almacenar el número de teléfono del paciente.
   */
  @Column()
  telefono: string;

  /**
   * @OneToMany():
   * - Define la relación uno-a-muchos con la entidad Turno.
   * - El primer parámetro `() => Turno` indica con qué entidad se relaciona.
   * - El segundo parámetro `(turno) => turno.paciente` le dice a TypeORM
   *   que esta relación está conectada con la propiedad "paciente" de la entidad Turno.
   * - Esto crea una relación bidireccional: desde Paciente se puede acceder a sus turnos,
   *   y desde un Turno se puede saber a qué paciente pertenece.
   */
  @OneToMany(() => Turno, (turno) => turno.paciente)
  turnos: Turno[];
}