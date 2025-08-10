// backend-gestor/src/turnos/entities/turno.entity.ts
// -----------------------------------------------------------------------------
// ENTIDAD Turno (TypeORM) -> se convierte en una tabla de la base de datos.
// Cada propiedad decorada con @Column/@PrimaryGeneratedColumn es una columna.
// Relación: muchos Turno pertenecen a un Paciente (ManyToOne).
// Además agregamos una restricción UNIQUE (fecha, hora) para evitar duplicados
// a nivel base de datos (además de chequearlo en el servicio).
// -----------------------------------------------------------------------------

// Decoradores/Tipos de TypeORM para mapear la clase a la tabla
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
// Entidad relacionada (lado “dueño” del turno)
import { Paciente } from '../../pacientes/entities/paciente.entity';

// @Entity()  -> marca la clase como tabla.
// @Unique(['fecha','hora']) -> índice/constraint único para que NO existan
//                              dos filas con la MISMA combinación fecha+hora.
// Nota sobre NULLs: Postgres permite múltiples NULL en columnas con UNIQUE,
// por eso los registros viejos con fecha/hora null no rompen esta regla.
@Entity()
@Unique(['fecha', 'hora'])
export class Turno {
  @PrimaryGeneratedColumn() // PK autoincremental
  id: number;

  @Column({ type: 'date' })  // columna DATE ('YYYY-MM-DD')
  fecha: string;             // p. ej. '2025-08-15'

  @Column({ type: 'time' })  // columna TIME ('HH:MM[:SS]')
  hora: string;              // p. ej. '14:30' -> DB suele guardarlo como '14:30:00'

  @Column({ type: 'text' })  // texto libre
  razon: string;             // p. ej. 'Consulta de control general'

  // Muchos turnos -> un paciente
  // onDelete: 'CASCADE'  -> si se elimina el Paciente, se borran sus Turnos.
  @ManyToOne(() => Paciente, (p) => p.turnos, { onDelete: 'CASCADE' })
  paciente: Paciente;
}

// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// "backend-gestor/src/turnos/turnos.controller.ts" → endpoints REST que usan
// esta entidad y el servicio. Si ya lo viste, pasá al front:
// "frontend-gestor/src/app/turnos/turnos.service.ts" (consume estos endpoints).
// -----------------------------------------------------------------------------