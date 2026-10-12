// backend-gestor/src/turnos/entities/turno.entity.ts
// -----------------------------------------------------------------------------
// ENTIDAD Turno (TypeORM)
// Acá defino cómo quiero que la tabla de turnos exista en la DB. Cada decorador
// (@Column, @PrimaryGeneratedColumn, etc.) indica una columna. Relación clave:
// muchos Turno → un Paciente (ManyToOne). También agrego una UNIQUE(fecha,hora)
// para respaldar en la DB la validación de “no duplicar” que hago en el servicio.
// -----------------------------------------------------------------------------

// Uso estos decoradores como "etiquetas" para que TypeORM haga el mapeo.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
// Entidad relacionada (el Paciente es el “dueño” de muchos Turno)
import { Paciente } from '../../pacientes/entities/paciente.entity';

// @Entity()  → marco la clase como tabla.
// @Unique(['fecha','hora']) → constraint para que no existan dos filas con la
// misma combinación fecha+hora. Nota: Postgres permite varios NULL en UNIQUE,
// así que no choca con datos legacy sin fecha/hora.
@Entity()
@Unique(['fecha', 'hora'])
export class Turno {
  @PrimaryGeneratedColumn() // quiero PK autoincremental
  id: number;

  @Column({ type: 'date' }) // guardo fecha como DATE ('YYYY-MM-DD')
  fecha: string; // ej: '2025-08-15'

  @Column({ type: 'time' }) // guardo hora como TIME ('HH:MM[:SS]')
  hora: string; // ej: '14:30' (la DB puede normalizar a '14:30:00')

  @Column({ type: 'text' }) // texto libre para el motivo
  razon: string; // ej: 'Consulta de control general'

  // Muchos turnos -> un paciente
  // onDelete: 'CASCADE'  -> si se elimina el Paciente, se borran sus Turnos.
  @ManyToOne(() => Paciente, (p) => p.turnos, { onDelete: 'CASCADE' })
  paciente: Paciente;
}

// -----------------------------------------------------------------------------
