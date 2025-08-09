// Importa PartialType desde @nestjs/mapped-types.
// PartialType recibe una clase y crea una nueva versión donde todos los campos son opcionales.
import { PartialType } from '@nestjs/mapped-types';

// Importa el DTO de creación para reutilizar su estructura y validaciones.
import { CreatePacienteDto } from './create-paciente.dto';

/**
 * DTO para actualizar un paciente existente.
 * - Extiende de PartialType(CreatePacienteDto):
 *   Esto significa que toma todos los campos y validaciones de CreatePacienteDto,
 *   pero hace que sean opcionales.
 * - De esta forma, podemos enviar solo el campo que queremos modificar
 *   (por ejemplo, cambiar solo el email y dejar los demás igual).
 */
export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}