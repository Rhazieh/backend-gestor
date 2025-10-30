// backend-gestor/src/turnos/dto/update-turno.dto.ts
// -----------------------------------------------------------------------------
// DTO para ACTUALIZAR un turno
// Decidí extender del DTO de creación pero haciendo TODOS los campos opcionales
// (PartialType). Así puedo aceptar PATCH/PUT con solo los cambios.
// Además:
//  • Permití (opcional) cambiar pacienteId.
//  • Soy tolerante con la hora: acepto "HH:MM" o "HH:MM:SS" para convivir con la DB/front.
// -----------------------------------------------------------------------------

// Recordatorio: PartialType convierte un DTO base a “todos los campos opcionales”.
import { PartialType } from '@nestjs/mapped-types';

// Sumo validadores para opcionalidad, enteros y patrón de hora flexible.
import { IsInt, IsOptional, Matches } from 'class-validator';

// Reutilizo campos/validaciones del DTO de creación.
import { CreateTurnoDto } from './create-turno.dto';

/**
 * ¿Qué gano con esto?
 * - Evito duplicar definiciones y mantengo una sola fuente de verdad.
 * - Si viene sólo un campo, igual se valida su formato.
 */
export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsOptional()
  @IsInt()
  // Me permito reasignar a otro paciente (si no viene, se mantiene el actual)
  pacienteId?: number;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/) // acepto "HH:MM" o "HH:MM:SS"
  // Decisión: acepto ambos para no rechazar datos válidos que vengan con segundos.
  hora?: string;
}
// -----------------------------------------------------------------------------
