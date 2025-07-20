import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// Este DTO se usa cuando queremos crear un nuevo paciente
export class CreatePacienteDto {
    @IsNotEmpty() // Valida que no este vacio
    @IsString() // Valida que sea un texto (String)
    nombre: string;

    @IsNotEmpty()
    @IsEmail() // Valida que tenga formato de email (con @ y dominio)
    email: string;

    @IsNotEmpty()
    @IsString()
    telefono: string;
}