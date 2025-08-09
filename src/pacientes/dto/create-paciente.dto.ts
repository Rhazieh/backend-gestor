// Importamos decoradores de la librería class-validator.
// Estos decoradores sirven para validar automáticamente los datos que llegan al backend.
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO (Data Transfer Object) para crear un nuevo paciente.
 * - Define la estructura y validaciones de los datos que se esperan.
 * - Se usa tanto si la petición viene del frontend como si se envía desde Postman.
 * - Si los datos no cumplen las validaciones, NestJS devuelve un error automáticamente
 *   antes de que el controlador llame al servicio.
 */
export class CreatePacienteDto {
  /**
   * nombre:
   * - @IsNotEmpty(): El valor no puede ser null, undefined o una cadena vacía.
   * - @IsString(): Debe ser texto; no se aceptan números, booleanos, etc.
   */
  @IsNotEmpty()
  @IsString()
  nombre: string;

  /**
   * email:
   * - @IsNotEmpty(): Obligatorio.
   * - @IsEmail(): Debe tener formato válido de email (ej. usuario@dominio.com).
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * telefono:
   * - @IsNotEmpty(): Obligatorio.
   * - @IsString(): Texto libre; por ahora no se valida un formato específico,
   *   así que podría ser "123456" o "+54 9 11 1234 5678".
   */
  @IsNotEmpty()
  @IsString()
  telefono: string;
}