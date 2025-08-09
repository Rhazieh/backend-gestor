// Importo decoradores de TypeORM para definir una entidad de base de datos
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
// Importo la entidad Paciente para poder relacionar un turno con un paciente
import { Paciente } from '../../pacientes/entities/paciente.entity';

// @Entity() indica que esta clase se mapea a una tabla en la base de datos
// @Unique(['fecha','hora']) impide dos filas con la misma fecha+hora (a nivel DB).
//  Nota: Postgres permite múltiples NULL bajo UNIQUE, así que los viejos registros
//  con null no romperán la sincronización.
@Entity()
@Unique(['fecha', 'hora'])
export class Turno {
  @PrimaryGeneratedColumn() // Columna ID autoincremental (PRIMARY KEY)
  id: number;

  @Column({ type: 'date' })  // Columna tipo fecha en formato 'YYYY-MM-DD'
  fecha: string;             // Ejemplo: '2025-08-15'

  @Column({ type: 'time' })  // Columna tipo hora en formato 'HH:MM' (24 horas)
  hora: string;              // Ejemplo: '14:30' -> se persiste como '14:30:00'

  @Column({ type: 'text' })  // Columna tipo texto libre
  razon: string;             // Ejemplo: 'Consulta de control general'

  // Relación Muchos-a-Uno: muchos turnos pueden pertenecer a un paciente
  // 'onDelete: CASCADE' significa que si borro un paciente, se borran sus turnos
  @ManyToOne(() => Paciente, (p) => p.turnos, { onDelete: 'CASCADE' })
  paciente: Paciente;
}
