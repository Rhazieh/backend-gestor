import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';

@Entity() // Esta clase representa una tabla en la base de datos
export class Turno {
    @PrimaryGeneratedColumn() // Columna autoincremental (Clave primaria)
    id: number;
    
    @Column() // Fecha del turno (solo fecha, sin hora)
    fecha: Date;
    
    @Column() // Hora del turno (podria ser string o tipo hora, depende de como lo manejemos)
    hora: string;

    @Column() // Texto explicando el motivo del turno
    razon: string;

    @ManyToOne(() => Paciente, (paciente) => paciente.turnos, { onDelete: 'CASCADE' })
    // Relacion MUCHOS turnos pertenecen a UN Paciente.
    // onDelete 'CASCADE' hace que si se elimina el paciente, se elimine tambien sus turnos
    paciente: Paciente;
}