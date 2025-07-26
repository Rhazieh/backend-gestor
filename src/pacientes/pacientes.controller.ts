// Este archivo define el controlador de pacientes.
// Acá van todas las rutas que el frontend puede usar para trabajar con pacientes.
// Por ejemplo: ver todos, crear uno nuevo, modificar uno existente o eliminarlo.

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

// Todas las rutas que estén acá van a empezar con /pacientes
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  // POST /pacientes
  // Crea un nuevo paciente. Los datos vienen en el body del request (JSON).
  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  // GET /pacientes
  // Devuelve todos los pacientes guardados en la base.
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  // GET /pacientes/:id
  // Busca un paciente por su ID (lo recibe como parámetro desde la URL).
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Lo convertimos a número porque los parámetros vienen como string
    return this.pacientesService.findOne(+id);
  }

  // PATCH /pacientes/:id
  // Actualiza un paciente según su ID. Solo cambia los campos que se envíen en el body.
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(+id, updatePacienteDto);
  }

  // DELETE /pacientes/:id
  // Elimina un paciente por su ID.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(+id);
  }
}