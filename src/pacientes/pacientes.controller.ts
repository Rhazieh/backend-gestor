// Este archivo define el "controlador" de pacientes, es decir,
// las rutas que se encargan de recibir las peticiones HTTP relacionadas con pacientes
// (como crear uno nuevo, verlos, actualizarlos o eliminarlos).

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('pacientes') // Todas las rutas que se definan acá van a comenzar con /pacientes
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  // POST /pacientes
  // Esta ruta sirve para crear un nuevo paciente.
  // Los datos llegan en el cuerpo del request (body), y se espera que sigan el formato del DTO correspondiente.
  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  // GET /pacientes
  // Esta ruta trae a todos los pacientes guardados en la base de datos.
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  // GET /pacientes/:id
  // Esta ruta sirve para obtener un solo paciente, buscando por su ID.
  @Get(':id')
  findOne(@Param('id') id: string) {
    // El id viene como string desde la URL, así que lo transformamos a número con +id
    return this.pacientesService.findOne(+id);
  }

  // PATCH /pacientes/:id
  // Esta ruta sirve para modificar un paciente existente, también buscando por su ID.
  // Se actualizan solo los campos que vengan en el body (no hace falta enviar todos).
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(+id, updatePacienteDto);
  }

  // DELETE /pacientes/:id
  // Esta ruta elimina un paciente según su ID.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(+id);
  }
}