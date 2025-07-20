import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Turno } from '../../turnos/entities/turno.entity'; // Importamos la clase Turno para hacer la relación

// Esta clase define cómo se va a crear la tabla "paciente" en la base de datos usando TypeORM
@Entity()
export class Paciente {
    // Esta columna va a ser la clave primaria (id) y se va a autogenerar sola, como cuando Excel numera filas automáticamente
    @PrimaryGeneratedColumn()
    id: number;

    // Esta columna guarda el nombre del paciente
    @Column()
    nombre: string;

    // Esta guarda el email del paciente
    @Column()
    email: string;

    // Esta guarda el número de teléfono
    @Column()
    telefono: string;

    // Relación con los turnos: un paciente puede tener muchos turnos
    // Esto sirve para que podamos acceder fácilmente a los turnos de un paciente desde la base de datos
    @OneToMany(() => Turno, (turno) => turno.paciente)
    turnos: Turno[];
}