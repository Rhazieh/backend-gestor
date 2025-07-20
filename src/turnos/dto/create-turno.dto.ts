import { IsNotEmpty, IsString, IsDateString, IsInt} from 'class-validator';

export class CreateTurnoDto {
    @IsNotEmpty()
    @IsDateString() // Valida que sea una fecha en formato ISO (Ej: 2025-08-15)
    fecha: string;

    @IsNotEmpty()
    @IsDateString() // Tambien usamos fecha para la hora, porque TypeORM no tiene "Solo hora"
    hora: string;

    @IsNotEmpty()
    @IsString()
    razon: string;

    @IsNotEmpty()
    @IsInt() // Debe ser un numero int (el ID del paciente)
    pacienteId: number; // Este campo se relaciona con el paciente
}