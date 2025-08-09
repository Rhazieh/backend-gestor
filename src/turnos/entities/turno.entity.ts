import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔧 Hacemos nullable: true por datos viejos que están en NULL
  @Column({ type: 'date', nullable: true })   // 'YYYY-MM-DD'
  fecha: string | null;

  @Column({ type: 'time', nullable: true })   // 'HH:MM'
  hora: string | null;

  @Column({ type: 'text', nullable: true })
  razon: string | null;

  @ManyToOne(() => Paciente, (p) => p.turnos, { onDelete: 'CASCADE' })
  paciente: Paciente;
}
