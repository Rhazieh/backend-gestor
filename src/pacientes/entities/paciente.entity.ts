import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Turno } '../../turnos/entities/turno.entity'; // Este archivo lo vamos a crear despues

@Entity() // Le dice a TypeORM: esta clase representa una tabla de la db".
export class Paciente { // por default la tabla se va a llamar como la clase pero en minusculas.
    @PrimaryGeneratedColumn() // Define una columna que sera la clave primaria (id) y ademas AUTOINCREMENTA SOLA, como excel que se enumera automaticamente
    id: number;

    @Column() //Este y los demas, le dice a TypeORM "Esto es una columna normal en la tabla, puede ser de cualquier tip string, int, date, boolean, cualquiera."
    nombre: string;

    @Column()
    email: string;

    @Column()
    telefono: string;
    
    // Se agregara despues cuando tengamos la entidad Turno
    @OneToMany(() => Turno, (turno) => turno.paciente) // Esto define una relacion 1:N (1 a muchos) aunque aun no lo estamos usando
    turnos: Turno[];
}