// Importo validadores de class-validator, que sirven para asegurarnos
// de que los datos que recibimos cumplen con el formato que queremos
import { IsNotEmpty, IsString, Matches } from 'class-validator';

// DTO (Data Transfer Object) para CREAR un turno
// Esto define qué campos tiene que mandar el cliente y cómo se validan
export class CreateTurnoDto {
  @IsNotEmpty() // No puede venir vacío
  @Matches(/^\d{4}-\d{2}-\d{2}$/) // Expresión regular para fecha 'YYYY-MM-DD'
  fecha: string; // Ejemplo válido: '2025-08-15'

  @IsNotEmpty() // No puede venir vacío
  @Matches(/^\d{2}:\d{2}$/) // Expresión regular para hora 'HH:MM' en 24hs
  hora: string; // Ejemplo válido: '14:30'

  @IsNotEmpty() // No puede venir vacío
  @IsString()   // Tiene que ser texto
  razon: string; // Ejemplo: 'Consulta de control'

  @IsNotEmpty() // No puede venir vacío
  pacienteId: number; // ID del paciente al que se le asigna este turno
}
