import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';

// Este DTO se usa para actualizar un paciente existente.
// Aprovechamos el DTO de creación, pero usamos PartialType para que todos los campos sean opcionales.
// Esto significa que se puede actualizar solo un campo (ej: el email) sin necesidad de enviar todos los datos.

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}