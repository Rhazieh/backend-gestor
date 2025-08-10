// backend-gestor/src/pacientes/pacientes.controller.ts
// -----------------------------------------------------------------------------
// CONTROLADOR DE PACIENTES (NestJS)
// Expone rutas REST para crear, listar, editar y borrar pacientes.
// Además, agrega las rutas "anidadas" para ver/crear turnos de un paciente.
// Nota: el mismo controller responde en español e inglés.
//  - Español:  /pacientes
//  - Inglés:   /patients
//  - Anidado:  /patients/:id/appointments  (GET/POST) → usa TurnosService
// -----------------------------------------------------------------------------

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe, // Convierte "id" (string de la URL) a number y valida.
} from '@nestjs/common';

import { PacientesService } from './pacientes.service';
import { TurnosService } from '../turnos/turnos.service';

// DTOs para validar el cuerpo de las peticiones relacionadas a Paciente.
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

// DTO mínimo para crear turnos desde /patients/:id/appointments
// (acá NO pedimos pacienteId en el body, lo tomamos desde la URL).
import { IsNotEmpty, IsString, Matches } from 'class-validator';
class CreateAppointmentFromPatientDto {
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/) // Formato estricto 'YYYY-MM-DD'
  fecha: string;

  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/) // Formato estricto 'HH:MM' (24h)
  hora: string;

  @IsNotEmpty()
  @IsString()
  razon: string;
}

// 👇 Un mismo controller "cuelga" de dos prefijos: /pacientes y /patients.
//    Es útil para mantener compatibilidad y cumplir el enunciado al mismo tiempo.
@Controller(['pacientes', 'patients'])
export class PacientesController {
  // Inyectamos los servicios que hacen la lógica real (DB, validaciones, etc.).
  constructor(
    private readonly pacientesService: PacientesService,
    private readonly turnosService: TurnosService, // lo usamos para endpoints de appointments
  ) {}

  // GET /pacientes  y  GET /patients
  // Devuelve la lista completa de pacientes (con sus turnos si el service los incluye).
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  // POST /pacientes  y  POST /patients
  // Crea un nuevo paciente a partir del body validado por CreatePacienteDto.
  @Post()
  create(@Body() body: CreatePacienteDto) {
    return this.pacientesService.create(body);
  }

  // PUT /pacientes/:id  y  PUT /patients/:id
  // Actualiza (reemplaza/parcial) un paciente.
  // ParseIntPipe asegura que :id sea number (si no, responde 400).
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePacienteDto) {
    return this.pacientesService.update(id, body);
  }

  // DELETE /pacientes/:id  y  DELETE /patients/:id
  // Elimina un paciente por ID (si la relación en Turno tiene onDelete: 'CASCADE',
  // también se borran sus turnos).
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.remove(id);
  }

  // GET /patients/:id/appointments  (también responde en /pacientes/:id/appointments)
  // Devuelve todos los turnos del paciente indicado por :id.
  @Get(':id/appointments')
  getAppointments(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findByPatient(id);
  }

  // POST /patients/:id/appointments  (idem en español)
  // Crea un turno para el paciente :id. El pacienteId lo tomamos de la URL,
  // así el body queda limpio con solo fecha/hora/razon.
  @Post(':id/appointments')
  createAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateAppointmentFromPatientDto,
  ) {
    // Delegamos en TurnosService.create y le "inyectamos" pacienteId desde la URL.
    return this.turnosService.create({
      fecha: body.fecha,
      hora: body.hora,
      razon: body.razon,
      pacienteId: id,
    } as any);
  }
}
// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// "backend-gestor/src/pacientes/pacientes.service.ts" → ahí está la lógica real
// de pacientes (acceso a base, create/find/update/delete) que este controller usa.
// -----------------------------------------------------------------------------