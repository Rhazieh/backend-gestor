// backend-gestor/src/pacientes/dto/create-paciente.dto.ts
// -----------------------------------------------------------------------------
// DTO PARA CREAR PACIENTES
// Acá defino la “forma” del body que quiero recibir en POST /pacientes (o /patients)
// y por qué. El ValidationPipe global va a leer estos decoradores y, si algo
// no cumple, corta con 400 antes de que llegue al controller.
// Acordate:
// - @IsNotEmpty → no acepto vacío/null/undefined.
// - @IsEmail    → quiero un email con formato real.
// - whitelist   → si me mandan campos extra, Nest los saca.
// -----------------------------------------------------------------------------

// Importamos decoradores de la librería class-validator para validar propiedades.
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

/**
 * ¿Por qué hago este DTO?
 * - Para tener validaciones declarativas y que el controller reciba datos “limpios”.
 * - Me sirve en defensa: explico que la validación está centralizada y automatizada.
 */
export class CreatePacienteDto {
  /**
   * nombre
   * Decisión: lo marco como string no vacío porque lo necesito para identificar al paciente.
   */
  @IsNotEmpty()
  @IsString()
  nombre: string;

  /**
   * email
   * Acordate: pido formato real para reducir errores de contacto desde el principio.
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * telefono
   * Por ahora acepto texto libre ("+54 9 11 ...").
   * Nota para mí: si en el futuro quiero un patrón estricto, agrego @Matches(/regex/).
   */
  @IsNotEmpty()
  @IsString()
  telefono: string;
}
// ----------------------------------------------------------------------------
