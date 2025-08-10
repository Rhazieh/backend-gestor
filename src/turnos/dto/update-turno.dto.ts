// backend-gestor/src/turnos/dto/update-turno.dto.ts
// -----------------------------------------------------------------------------
// DTO para ACTUALIZAR un turno existente
//
// Idea clave: extender del DTO de creación pero volviendo TODOS los campos
// opcionales. Así el cliente puede mandar solo lo que quiere cambiar.
// Además:
//  • Permitimos (opcional) cambiar el paciente: pacienteId?
//  • Aceptamos hora en "HH:MM" o "HH:MM:SS" para ser tolerantes con lo que
//    devuelva/envíe el front o la DB.
// -----------------------------------------------------------------------------

// PartialType toma un DTO base y lo convierte en “todos los campos opcionales”.
import { PartialType } from '@nestjs/mapped-types';

// Validadores extra: opcionalidad, enteros y patrón para hora flexible.
import { IsInt, IsOptional, Matches } from 'class-validator';

// Reutilizamos campos/validaciones de creación.
import { CreateTurnoDto } from './create-turno.dto';

/**
 * Extiende de PartialType(CreateTurnoDto):
 *  - Copia todos los campos de CreateTurnoDto
 *  - Los marca como OPCIONALES (para PATCH/PUT parciales)
 */
export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsOptional()
  @IsInt()
  // Reasignar a otro paciente (si no viene, se mantiene el actual)
  pacienteId?: number;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/) // acepta "HH:MM" o "HH:MM:SS"
  // Permitimos ambos formatos para evitar rechazar datos válidos que vengan con segundos.
  hora?: string;
}
// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// "backend-gestor/src/turnos/entities/turno.entity.ts" → estructura en DB y
// relación con Paciente (ManyToOne + onDelete: 'CASCADE').
// -----------------------------------------------------------------------------