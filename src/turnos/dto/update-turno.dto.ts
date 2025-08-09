// Importa PartialType desde @nestjs/mapped-types.
// PartialType toma un DTO existente y genera una nueva clase
// en la que todos los campos son OPCIONALES.
import { PartialType } from '@nestjs/mapped-types';

// Importa validadores extra por si queremos permitir cambiar el paciente también.
import { IsInt, IsOptional, Matches } from 'class-validator';

// Importa el DTO de creación de turnos para reutilizar sus campos y validaciones.
import { CreateTurnoDto } from './create-turno.dto';

/**
 * DTO para actualizar un turno existente.
 * - Extiende de PartialType(CreateTurnoDto):
 *   * Copia todos los campos y validaciones de CreateTurnoDto.
 *   * Marca cada campo como OPCIONAL.
 * - Además, permito (opcional) cambiar el paciente del turno usando pacienteId.
 * - Y permito hora con "HH:MM" **o** "HH:MM:SS" para compatibilidad.
 */
export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsOptional()
  @IsInt()
  // Cambiar el paciente del turno es opcional; si no viene, no se toca.
  pacienteId?: number;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/) // acepta HH:MM o HH:MM:SS
  hora?: string;
}
