import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// Este DTO se usa cuando se va a **crear un nuevo paciente** desde el frontend o desde Postman.
// Acá se define qué datos esperamos y cómo validarlos automáticamente.

export class CreatePacienteDto {
  @IsNotEmpty() // No puede estar vacío
  @IsString()   // Debe ser texto (no número ni booleano, por ejemplo)
  nombre: string;

  @IsNotEmpty()
  @IsEmail()    // Valida que tenga un formato de email válido (algo@ejemplo.com)
  email: string;

  @IsNotEmpty()
  @IsString()   // Debe ser texto. Por ahora no validamos formato de teléfono.
  telefono: string;
}