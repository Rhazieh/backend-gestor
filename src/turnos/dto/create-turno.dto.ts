// backend-gestor/src/turnos/dto/create-turno.dto.ts
// -----------------------------------------------------------------------------
// DTO para CREAR un turno
// Acá defino la forma exacta del body que quiero recibir y por qué. El
// ValidationPipe (global) va a leer estos decoradores y, si algo no cierra,
// devuelve 400 antes de que el request llegue al controller.
// Acordate: acá valido FORMATO; las reglas de negocio (existe paciente,
// no duplicar fecha+hora) las manejo en el servicio.
// -----------------------------------------------------------------------------

// Validadores de class-validator (se aplican campo por campo)
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateTurnoDto {
  @IsNotEmpty() // no acepto null/undefined/''
  @Matches(/^\d{4}-\d{2}-\d{2}$/) // quiero 'YYYY-MM-DD' (ej: '2025-08-15')
  // Nota para mí: esto no valida calendario real (31/02 pasaría). Si lo necesito, lo hago en el service.
  fecha: string;

  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/) // pido 'HH:MM' 24hs (ej: '14:30').
  // Si llega '15:00:00' no pasa: prefiero normalizar desde el backend.
  hora: string;

  @IsNotEmpty()
  @IsString() // texto libre (el front muestra errores si quiere limitar más)
  razon: string; // ej: 'Consulta de control'

  @IsNotEmpty() // necesito asociarlo a un paciente existente
  // El servicio valida que exista (si no, 404).
  pacienteId: number;
}
// -----------------------------------------------------------------------------
