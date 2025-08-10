// backend-gestor/src/pacientes/dto/update-paciente.dto.ts
// -----------------------------------------------------------------------------
// DTO PARA ACTUALIZAR PACIENTES
// En lugar de volver a escribir todas las reglas de CreatePacienteDto,
// usamos PartialType(CreatePacienteDto) para decir:
//   “Tomá el mismo DTO de creación, pero hacé TODOS sus campos OPCIONALES”.
// Esto sirve para PATCH/PUT donde podés mandar solo lo que querés cambiar.
// -----------------------------------------------------------------------------

// PartialType viene de @nestjs/mapped-types y genera una clase “parcial”.
import { PartialType } from '@nestjs/mapped-types';

// Reutilizamos la estructura y validaciones del DTO de creación.
import { CreatePacienteDto } from './create-paciente.dto';

/**
 * UpdatePacienteDto:
 * - Hereda todos los campos de CreatePacienteDto (nombre, email, telefono).
 * - Los marca como opcionales => podés enviar 1, 2 o los 3, o mezclar.
 * - Mantiene las VALIDACIONES originales en cada campo que envíes.
 */
export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}
// ----------------------------------------------------------------------------