// backend-gestor/src/pacientes/dto/create-paciente.dto.ts
// -----------------------------------------------------------------------------
// DTO PARA CREAR PACIENTES (class-validator)
// Un DTO define la “forma” de los datos que esperamos recibir y cómo validarlos.
// Este se usa cuando recibimos un POST /pacientes (o /patients).
// Con el ValidationPipe global (ver main.ts) Nest valida automáticamente:
//  - Si falta un campo @IsNotEmpty → 400 Bad Request
//  - Si el email no tiene formato válido → 400
//  - Si llegan campos EXTRA que no están en el DTO → se quitan (whitelist: true)
// -----------------------------------------------------------------------------

// Importamos decoradores de la librería class-validator para validar propiedades.
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO (Data Transfer Object) para crear un nuevo paciente.
 * - Define estructura y validaciones de entrada.
 * - Se aplica tanto si la petición viene del frontend como desde Postman/cURL.
 * - Si no cumple, el ValidationPipe corta antes de llegar al controller/service.
 */
export class CreatePacienteDto {
  /**
   * nombre:
   * - @IsNotEmpty(): no puede venir vacío, null o undefined.
   * - @IsString(): debe ser texto (si viene un número/booleano falla).
   */
  @IsNotEmpty()
  @IsString()
  nombre: string;

  /**
   * email:
   * - @IsNotEmpty(): obligatorio.
   * - @IsEmail(): formato real de email (usuario@dominio.tld).
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * telefono:
   * - @IsNotEmpty(): obligatorio.
   * - @IsString(): por ahora aceptamos texto libre (podría ser “+54 9 11 ...”).
   *   Si quisieras forzar un patrón específico, acá podrías sumar @Matches(/regex/).
   */
  @IsNotEmpty()
  @IsString()
  telefono: string;
}
// ----------------------------------------------------------------------------