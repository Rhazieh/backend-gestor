import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// Este DTO (Data Transfer Object) define cómo deben venir los datos
// cuando queremos crear un nuevo paciente desde el frontend o Postman.
// Sirve para validar automáticamente los campos y evitar que lleguen datos vacíos o inválidos.

export class CreatePacienteDto {
    @IsNotEmpty() // Asegura que el campo no esté vacío (requerido)
    @IsString()   // Valida que sea un texto (no número ni booleano)
    nombre: string;

    @IsNotEmpty()
    @IsEmail()    // Valida que tenga formato de email válido (ej: alguien@algo.com)
    email: string;

    @IsNotEmpty()
    @IsString()   // También se espera un texto para el teléfono (no hace validación de formato específico)
    telefono: string;
}