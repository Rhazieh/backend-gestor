import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

// Este DTO (Data Transfer Object) define los datos que necesitamos cuando alguien quiere cargar un nuevo turno.
// Sirve para validar que lo que nos mandan desde el frontend o Postman esté bien y no falte nada.
export class CreateTurnoDto {
    @IsNotEmpty() // Valida que venga algo y no esté vacío
    @IsDateString() // Se asegura que tenga formato de fecha (ej: 2025-08-15)
    fecha: string;

    @IsNotEmpty()
    @IsDateString() // Aunque sea una hora, lo validamos como fecha por compatibilidad con TypeORM
    hora: string;

    @IsNotEmpty()
    @IsString() // Tiene que ser texto, por ejemplo “Consulta general”
    razon: string;

    @IsNotEmpty()
    @IsInt() // Tiene que ser un número entero, porque este es el ID del paciente al que se le asigna el turno
    pacienteId: number; // Este valor se usa para vincular el turno con un paciente que ya esté creado
}