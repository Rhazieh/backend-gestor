
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity'; // Importamos la entidad Paciente para usarla en la relación

// Esta clase representa la tabla "turno" en la base de datos.
// Cada instancia de esta clase es un registro (fila) en la tabla.
@Entity()
export class Turno {
    @PrimaryGeneratedColumn() 
    // Columna autoincremental que va a ser la clave primaria (id del turno).
    // Se genera sola cuando creamos un nuevo turno.
    id: number;

    @Column()
    // Columna que guarda la fecha del turno (en formato Date).
    fecha: Date;

    @Column()
    // Columna que guarda la hora del turno como string.
    // Usamos string porque TypeORM no tiene tipo "solo hora".
    hora: string;

    @Column()
    // Columna donde escribimos el motivo del turno (texto libre).
    razon: string;

    @ManyToOne(() => Paciente, (paciente) => paciente.turnos, { onDelete: 'CASCADE' })
    // Relación MUCHOS turnos pertenecen a UN paciente (ManyToOne).
    // onDelete: 'CASCADE' significa que si se borra el paciente,
    // también se borran automáticamente sus turnos.
    paciente: Paciente;
}