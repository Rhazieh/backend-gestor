// Controller de Pacientes
// Ojo: expone las rutas en español Y en inglés al mismo tiempo.
//   - Español   -> /pacientes (...)
//   - Inglés    -> /patients (...)
//   - Inglés anidado -> /patients/:id/appointments  (GET/POST)  -> usa TurnosService
//
// Lo hago así para cumplir el enunciado sin romper tu front actual que usa /pacientes.

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { PacientesService } from './pacientes.service';
import { TurnosService } from '../turnos/turnos.service';

// Tus DTOs de pacientes (ajustá import si tu ruta difiere)
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

// Para crear appointments desde /patients/:id/appointments NO pido pacienteId en el body.
// Defino un DTO cortito que valida fecha/hora/razon.
import { IsNotEmpty, IsString, Matches } from 'class-validator';
class CreateAppointmentFromPatientDto {
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/) // 'YYYY-MM-DD'
  fecha: string;

  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/) // 'HH:MM' 24h
  hora: string;

  @IsNotEmpty()
  @IsString()
  razon: string;
}

// 👇 Con este array, el MISMO controller responde en /pacientes y /patients
@Controller(['pacientes', 'patients'])
export class PacientesController {
  constructor(
    private readonly pacientesService: PacientesService,
    private readonly turnosService: TurnosService, // lo uso para appointments
  ) {}

  // GET /pacientes  y  GET /patients
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  // POST /pacientes  y  POST /patients
  @Post()
  create(@Body() body: CreatePacienteDto) {
    return this.pacientesService.create(body);
  }

  // PUT /pacientes/:id  y  PUT /patients/:id
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePacienteDto) {
    return this.pacientesService.update(id, body);
  }

  // DELETE /pacientes/:id  y  DELETE /patients/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.remove(id);
  }

  // GET /patients/:id/appointments   (también responde en /pacientes/:id/appointments por el array)
  @Get(':id/appointments')
  getAppointments(@Param('id', ParseIntPipe) id: number) {
    // Devuelvo los turnos del paciente id
    return this.turnosService.findByPatient(id);
  }

  // POST /patients/:id/appointments  (idem español por el array)
  @Post(':id/appointments')
  createAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateAppointmentFromPatientDto,
  ) {
    // Delego en TurnosService.create y le inyecto el pacienteId desde la URL
    return this.turnosService.create({
      fecha: body.fecha,
      hora: body.hora,
      razon: body.razon,
      pacienteId: id,
    } as any);
  }
}
