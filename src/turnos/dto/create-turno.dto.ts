// Importa validadores de la librería class-validator.
// Estos decoradores permiten que NestJS valide automáticamente la entrada antes de llegar al servicio.
import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

/**
 * DTO (Data Transfer Object) para crear un nuevo turno.
 * - Define la estructura de datos que se espera recibir.
 * - Aplica validaciones automáticas usando class-validator.
 * - Si la validación falla, NestJS devuelve un error 400 (Bad Request) antes de ejecutar la lógica.
 */
export class CreateTurnoDto {
  /**
   * fecha:
   * - @IsNotEmpty(): Campo obligatorio, no puede ser null, undefined ni vacío.
   * - @IsDateString(): Debe tener formato de fecha ISO válido (ej. "2025-08-09").
   * - Se envía como string desde el frontend y luego se convierte a Date en el servicio.
   */
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  /**
   * hora:
   * - @IsNotEmpty(): Campo obligatorio.
   * - @IsDateString(): Aunque representa solo la hora, se usa IsDateString para aprovechar la validación
   *   de formato y compatibilidad con cómo TypeORM mapea fechas/horas.
   *   Otra alternativa sería usar un validador personalizado o un patrón con @Matches().
   * - En la base se guarda como string (ej: "14:30") definido en la entidad.
   */
  @IsNotEmpty()
  @IsDateString()
  hora: string;

  /**
   * razon:
   * - @IsNotEmpty(): Campo obligatorio.
   * - @IsString(): Debe ser texto (ej: "Consulta general").
   * - No se valida la longitud aquí, pero podría agregarse con @Length(min, max).
   */
  @IsNotEmpty()
  @IsString()
  razon: string;

  /**
   * pacienteId:
   * - @IsNotEmpty(): Obligatorio.
   * - @IsInt(): Debe ser un número entero (ID de un paciente existente en la base).
   * - Este ID se usa para enlazar el turno al paciente correcto en la relación ManyToOne.
   */
  @IsNotEmpty()
  @IsInt()
  pacienteId: number;
}