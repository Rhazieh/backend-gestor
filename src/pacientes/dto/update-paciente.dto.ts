// backend-gestor/src/pacientes/dto/update-paciente.dto.ts
// -----------------------------------------------------------------------------
// DTO PARA ACTUALIZAR PACIENTES
// Decidí extender del DTO de creación con PartialType para no duplicar reglas.
// Traducción: "tomá CreatePacienteDto y volvé TODOS sus campos opcionales".
// Me sirve para PATCH/PUT donde quiero mandar solo lo que cambia.
// -----------------------------------------------------------------------------

// Acordate: PartialType (de @nestjs/mapped-types) genera una clase “parcial”.
import { PartialType } from '@nestjs/mapped-types';

// Reutilizo la estructura y validaciones del DTO de creación.
import { CreatePacienteDto } from './create-paciente.dto';

/**
 * ¿Por qué así?
 * - Mantengo coherencia de validaciones y evito repetir.
 * - Si el body trae solo un campo, igual se validan las reglas de ese campo.
 */
export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}
// ----------------------------------------------------------------------------
