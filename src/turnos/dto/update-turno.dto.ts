import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turno.dto';

// Este DTO se usa cuando queremos actualizar un turno ya existente.
// Extendemos de CreateTurnoDto, pero con PartialType:
// lo que hace PartialType es convertir todos los campos en OPCIONALES.
// Así no es obligatorio mandar todos los datos, solo los que queramos modificar.
export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}