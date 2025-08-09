// Importa PartialType desde @nestjs/mapped-types.
// PartialType toma un DTO existente y genera una nueva clase
// en la que todos los campos son opcionales.
import { PartialType } from '@nestjs/mapped-types';

// Importa el DTO de creación de turnos para reutilizar sus campos y validaciones.
import { CreateTurnoDto } from './create-turno.dto';

/**
 * DTO para actualizar un turno existente.
 * - Extiende de PartialType(CreateTurnoDto):
 *   * Copia todos los campos y validaciones de CreateTurnoDto.
 *   * Marca cada campo como opcional.
 * - Esto permite que, al actualizar un turno, se pueda enviar únicamente
 *   el dato que queremos modificar (por ejemplo, solo la hora o la razón)
 *   sin tener que enviar todos los campos obligatorios de la creación.
 */
export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}