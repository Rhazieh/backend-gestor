import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity'; // Importamos la entidad Paciente para hacer la relación entre ambos

// Esta clase define cómo va a ser la tabla "turno" en la base de datos.
// Cada propiedad es una columna, y cada turno guardado es una fila (registro).
@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  // Esta columna es la clave primaria (id), se genera automáticamente
  // Es como un número único que identifica a cada turno
  id: number;

  @Column()
  // Guarda la fecha del turno (solo la fecha, no la hora)
  // Se usa el tipo Date aunque venga como string en el DTO, porque TypeORM lo guarda así en la base
  fecha: Date;

  @Column()
  // Guarda la hora del turno como texto (string), porque TypeORM no tiene tipo "solo hora"
  hora: string;

  @Column()
  // Guarda el motivo o la razón del turno (por ejemplo: "control general", "dolor de cabeza", etc.)
  razon: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.turnos, { onDelete: 'CASCADE' })
  // Relación de muchos turnos para un mismo paciente
  // Esto permite que cada turno esté conectado con el paciente que lo pidió
  // El "onDelete: 'CASCADE'" significa que si se borra el paciente, se borran todos sus turnos automáticamente
  paciente: Paciente;
}