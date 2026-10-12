// backend-gestor/src/turnos/turnos.controller.ts
// -----------------------------------------------------------------------------
// CONTROLADOR DE TURNOS
// Acá defino endpoints para crear/listar/consultar/actualizar/eliminar turnos
// y dejo la lógica de negocio en TurnosService.
// Decisión: respondo con dos prefijos a la vez para no duplicar código y cumplir
// el enunciado:
//   - Español:      /turnos
//   - Inglés:       /appointments
// Ojo: GET /turnos y GET /appointments terminan en el mismo método.
//
// Validación (recordatorio):
// - Los body se chequean con CreateTurnoDto/UpdateTurnoDto gracias al ValidationPipe global.
// - ParseIntPipe me convierte :id (string) a number y devuelve 400 si no puede.
// -----------------------------------------------------------------------------

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe, // Convierte params string → number y tira 400 si no puede.
  Query,
} from '@nestjs/common';

import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

// Uso un mismo controller colgado de dos rutas base: /turnos y /appointments
@Controller(['turnos', 'appointments'])
export class TurnosController {
  // Le pido a Nest que me “pase” el TurnosService. Quiero que el controller
  // coordine y el servicio haga el trabajo con la DB.
  constructor(private readonly turnosService: TurnosService) {}

  /**
   * POST /turnos  (y /appointments)
   * ¿Por qué pido el DTO acá?
   * - Para garantizar que fecha/hora/razon/pacienteId vengan en el formato que espero.
   * Estrategia: después de crear, vuelvo a pedir el turno con findOne para devolver
   * también el paciente relacionado (le simplifico la vida al front).
   */
  @Post()
  async create(@Body() createTurnoDto: CreateTurnoDto) {
    const nuevo = await this.turnosService.create(createTurnoDto);
    return this.turnosService.findOne(nuevo.id);
  }

  /**
   * GET /turnos  (y /appointments)
   * Listo turnos. Si me pasan query params, los transformo y delego el filtrado
   * al servicio (DB). Sino, devuelvo todo.
   */
  @Get()
  findAll(
    @Query('fecha') fecha?: string, // espero 'YYYY-MM-DD'
    @Query('pacienteId') pacienteId?: string, // llega como string
  ) {
    // Si llegan filtros, delego al service para filtrar en DB.
    if (fecha || pacienteId) {
      const pid = pacienteId ? Number(pacienteId) : undefined;
      return this.turnosService.findByFilters({ fecha, pacienteId: pid });
    }
    return this.turnosService.findAll();
  }

  /**
   * GET /turnos/:id  (y /appointments/:id)
   * Quiero traer un turno puntual por ID. ParseIntPipe me cuida el tipo.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findOne(id);
  }

  /**
   * PUT /turnos/:id  (y /appointments/:id)
   * Actualizo datos de un turno usando UpdateTurnoDto (campos opcionales).
   * Incluyo PUT explícito porque el enunciado lo pide.
   */
  @Put(':id')
  updatePut(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  /**
   * PATCH /turnos/:id  (y /appointments/:id)
   * Permití PATCH para actualizaciones parciales; sigo usando UpdateTurnoDto.
   */
  @Patch(':id')
  updatePatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  /**
   * DELETE /turnos/:id  (y /appointments/:id)
   * Elimino un turno por ID. El service se encarga de validar existencia.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.remove(id);
  }
}
// ----------------------------------------------------------------------------
