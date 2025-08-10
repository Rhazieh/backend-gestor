// backend-gestor/src/turnos/dto/create-turno.dto.ts
// -----------------------------------------------------------------------------
// DTO (Data Transfer Object) para CREAR un turno
// Define la FORMA y las REGLAS de lo que el backend acepta en el body.
// El ValidationPipe global (ver main.ts) usa estos decoradores para validar
// automáticamente la request y devolver 400 si algo no cumple.
// Importante: acá solo validamos formato. Otras validaciones de negocio
// (existencia de paciente, colisiones de fecha/hora) se hacen en TurnosService.
// -----------------------------------------------------------------------------

// Validadores de class-validator (se aplican campo por campo)
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateTurnoDto {
  @IsNotEmpty() // no se acepta null/undefined/''
  @Matches(/^\d{4}-\d{2}-\d{2}$/) // formato exacto 'YYYY-MM-DD' (p. ej. '2025-08-15')
  // Nota: no valida calendario real (31/02 pasaría). Para eso, validás en el servicio si querés.
  fecha: string;

  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/) // formato exacto 'HH:MM' (24hs). Ej: '14:30'
  // Nota: si llega '15:00:00' no pasa; el servicio guarda 'HH:MM' y el DB puede normalizar.
  hora: string;

  @IsNotEmpty()
  @IsString() // texto libre (tu front ya limita y muestra errores)
  razon: string; // Ej: 'Consulta de control'

  @IsNotEmpty() // requerido para asociar el turno a un paciente existente
  // El servicio verifica que el paciente con este id exista (404 si no)
  pacienteId: number;
}
// -----------------------------------------------------------------------------
