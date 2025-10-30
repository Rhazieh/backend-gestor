// backend-gestor/src/pacientes/pacientes.controller.ts
// -----------------------------------------------------------------------------
// CONTROLADOR DE PACIENTES
// Acá decido las rutas HTTP de pacientes y dejo la lógica "pesada" en
// PacientesService. También traigo TurnosService para manejar las rutas
// anidadas de appointments/turnos bajo /patients/:id/appointments y /pacientes/:id/turnos.
// Mi objetivo: que quede claro qué endpoint hace qué, y por qué inyecto cada servicio.
// Nota: este mismo controller responde con dos prefijos para cumplir enunciado
// sin duplicar código:
//  - Español:  /pacientes
//  - Inglés:   /patients
//  - Anidados:
//    • /patients/:id/appointments (GET/POST) → inglés
//    • /pacientes/:id/turnos (GET/POST) → español
//    Ambos delegan en TurnosService
// -----------------------------------------------------------------------------

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe, // Uso ParseIntPipe como "filtro" para convertir :id (string) a number y validar.
} from '@nestjs/common';

import { PacientesService } from './pacientes.service';
import { TurnosService } from '../turnos/turnos.service';
import { CreateTurnoDto } from '../turnos/dto/create-turno.dto';

// Acordate: estos DTOs los lee el ValidationPipe global antes de entrar a mis métodos.
// Así me aseguro de que el body tiene la forma correcta.
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

// Armo un DTO mínimo para crear turnos desde /patients/:id/appointments.
// Decisión: acá NO pido pacienteId en el body porque ya lo tengo en la URL.
import { IsNotEmpty, IsString, Matches } from 'class-validator';
class CreateAppointmentFromPatientDto {
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/) // Ojo: formato estricto 'YYYY-MM-DD' para evitar ambigüedades.
  fecha: string;

  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/) // Mantengo 'HH:MM' (24h) para que el servicio no tenga que normalizar acá.
  hora: string;

  @IsNotEmpty()
  @IsString()
  razon: string;
}

// Ojo con esto: uso dos prefijos a la vez (['/pacientes','/patients']).
// Lo hago para no duplicar endpoints y mantener compatibilidad.
@Controller(['pacientes', 'patients'])
export class PacientesController {
  // Inyecto los servicios que necesito. Idea clave: que el controller
  // solo coordine y la lógica viva en los services.
  constructor(
    private readonly pacientesService: PacientesService,
    private readonly turnosService: TurnosService, // lo uso en los endpoints de appointments
  ) {}

  // GET /pacientes  y  GET /patients
  // Quiero devolver la lista completa de pacientes. El service ya decide si incluye turnos.
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  // POST /pacientes  y  POST /patients
  // Creo un paciente nuevo. Acordate que el ValidationPipe ya validó CreatePacienteDto.
  @Post()
  create(@Body() body: CreatePacienteDto) {
    return this.pacientesService.create(body);
  }

  // PUT /pacientes/:id  y  PUT /patients/:id
  // Actualizo un paciente existente. ParseIntPipe me asegura que :id sea number (400 si no).
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(id, body);
  }

  // DELETE /pacientes/:id  y  DELETE /patients/:id
  // Elimino un paciente por ID. Recordatorio: en Turno configuré onDelete:'CASCADE',
  // así que sus turnos también se van automáticamente.
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.remove(id);
  }

  // GET /patients/:id/appointments y /pacientes/:id/turnos
  // Quiero ver todos los turnos del paciente :id. Delego la query al TurnosService.
  // Respondo en ambos idiomas: appointments (inglés) y turnos (español).
  @Get([':id/appointments', ':id/turnos'])
  getAppointments(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findByPatient(id);
  }

  // POST /patients/:id/appointments y /pacientes/:id/turnos
  // Creo un turno para el paciente :id. Decidí NO pedir pacienteId en el body
  // porque ya lo tengo en la URL; así el body queda limpio (fecha/hora/razon).
  @Post([':id/appointments', ':id/turnos'])
  createAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateAppointmentFromPatientDto,
  ) {
    // Delego en TurnosService.create y le paso pacienteId desde la URL.
    const dto: CreateTurnoDto = {
      fecha: body.fecha,
      hora: body.hora,
      razon: body.razon,
      pacienteId: id,
    };
    return this.turnosService.create(dto);
  }
}
// ----------------------------------------------------------------------------
