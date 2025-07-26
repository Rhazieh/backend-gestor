import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Turno } from '../../turnos/entities/turno.entity'; // Importamos la entidad Turno para hacer la relación 1:N

// Esta clase representa la tabla "paciente" en la base de datos.
// Cada vez que creemos un nuevo Paciente desde el backend, se va a guardar en esta tabla.
@Entity()
export class Paciente {
  @PrimaryGeneratedColumn()
  // ID autoincremental (clave primaria). Se genera solo, como si fuera una fila nueva en Excel.
  id: number;

  @Column()
  // Columna para el nombre del paciente
  nombre: string;

  @Column()
  // Columna para el email
  email: string;

  @Column()
  // Columna para el teléfono del paciente
  telefono: string;

  @OneToMany(() => Turno, (turno) => turno.paciente)
  // Relación 1:N → Un paciente puede tener muchos turnos.
  // Esta relación nos permite acceder a todos los turnos que tiene un paciente.
  turnos: Turno[];
}