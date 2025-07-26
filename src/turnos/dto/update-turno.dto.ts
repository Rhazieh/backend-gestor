import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turno.dto';

// Este DTO se usa para actualizar un turno.
// Usa el DTO de creación como base, pero con PartialType convierte todos los campos en OPCIONALES.
// Así se puede enviar solo lo que se quiera cambiar (por ejemplo, solo la hora o la razón).
export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}