// backend-gestor/src/pacientes/entities/paciente.entity.ts
// -----------------------------------------------------------------------------
// ENTIDAD "PACIENTE" (TypeORM)
// Esta clase mapea una tabla de la base de datos. Cada decorador (@Column, etc.)
// le dice a TypeORM cómo crear/leer las columnas. La relación con Turno es 1:N:
// un Paciente puede tener muchos Turnos.
// -----------------------------------------------------------------------------

// Decoradores de TypeORM para definir tabla, columnas y relaciones.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// Importamos Turno para declarar la relación 1:N (Paciente → Turnos).
import { Turno } from '../../turnos/entities/turno.entity';

/**
 * @Entity():
 * - Señala que esta clase es una tabla de la DB.
 * - Si no le pasás nombre, usa el nombre de la clase en snake_case (ej. "paciente").
 */
@Entity()
export class Paciente {
  /**
   * @PrimaryGeneratedColumn():
   * - Crea una columna "id" autoincremental (PRIMARY KEY).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @Column():
   * - Columna de texto para el nombre.
   * - Por defecto VARCHAR (depende del motor).
   */
  @Column()
  nombre: string;

  /**
   * @Column():
   * - Columna de texto para el email.
   * - La validación de formato se hace en el DTO (no acá).
   */
  @Column()
  email: string;

  /**
   * @Column():
   * - Columna de texto para el teléfono.
   */
  @Column()
  telefono: string;

  /**
   * @OneToMany(() => Turno, (turno) => turno.paciente)
   * - Declara el "lado inverso" de la relación. Acá NO hay FK ni columna extra;
   *   la FK vive del lado ManyToOne (en Turno.paciente) → ese es el "lado dueño".
   * - Gracias a esto, cuando pedimos un Paciente con relations:['turnos'],
   *   TypeORM trae el array de Turno[] asociado.
   *
   * Nota: el borrado en cascada se definió del lado de Turno con
   *   onDelete: 'CASCADE' en @ManyToOne, por eso al borrar un paciente
   *   se borran también sus turnos.
   */
  @OneToMany(() => Turno, (turno) => turno.paciente)
  turnos: Turno[];
}
// ----------------------------------------------------------------------------