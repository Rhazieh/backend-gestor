import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

// Este DTO (Data Transfer Object) sirve para validar los datos cuando se quiere crear un nuevo turno.
// Se asegura que no falte ningún campo y que tengan el formato correcto.

export class CreateTurnoDto {
  @IsNotEmpty()        // No puede venir vacío
  @IsDateString()      // Tiene que tener formato de fecha (yyyy-mm-dd)
  fecha: string;

  @IsNotEmpty()
  @IsDateString()      // También usamos formato de fecha aunque sea una hora, para que sea compatible con TypeORM
  hora: string;

  @IsNotEmpty()
  @IsString()          // Debe ser un texto (por ejemplo: "Consulta general")
  razon: string;

  @IsNotEmpty()
  @IsInt()             // Tiene que ser un número entero (el ID del paciente al que se le asigna el turno)
  pacienteId: number;  // Esto se usa para relacionar el turno con un paciente ya existente
}