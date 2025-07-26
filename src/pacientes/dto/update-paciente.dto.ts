
import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';

// Este DTO se usa cuando queremos **actualizar un paciente** que ya existe.
// Usamos `PartialType` para **reutilizar el DTO de creación**, pero haciendo que todos los campos sean opcionales.
// Así podemos mandar solo lo que queremos modificar (por ejemplo, solo el email).
export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}