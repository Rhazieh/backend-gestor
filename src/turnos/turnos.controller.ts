// backend-gestor/src/turnos/turnos.controller.ts
// -----------------------------------------------------------------------------
// CONTROLADOR DE TURNOS (NestJS)
// Expone las rutas HTTP para manejar turnos.
// Importante: responde con DOS prefijos a la vez para no romper nada y cumplir el enunciado:
//   - Español:      /turnos
//   - Inglés:       /appointments
// Ej: GET /turnos  y GET /appointments llaman al mismo método.
//
// Nota sobre validación:
// - Los cuerpos (body) se validan con los DTOs (CreateTurnoDto / UpdateTurnoDto).
// - El ValidationPipe global (ver main.ts) aplica esas reglas automáticamente.
// - ParseIntPipe convierte :id (string en URL) a number y valida que sea numérico.
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
} from '@nestjs/common';

import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

// 👇 Un mismo controller colgado de dos rutas base: /turnos y /appointments
@Controller(['turnos', 'appointments'])
export class TurnosController {
  // Inyectamos el servicio con la lógica real (acceso a DB, etc.)
  constructor(private readonly turnosService: TurnosService) {}

  /**
   * POST /turnos        (y también /appointments)
   * Crea un nuevo turno.
   * Flujo:
   * 1) Valida el body con CreateTurnoDto (fecha/hora/razon/pacienteId).
   * 2) turnosService.create(...) guarda y devuelve el turno.
   * 3) Para comodidad del front, volvemos a pedirlo con findOne(nuevo.id)
   *    para traer también las relaciones (paciente).
   */
  @Post()
  async create(@Body() createTurnoDto: CreateTurnoDto) {
    const nuevo = await this.turnosService.create(createTurnoDto);
    return this.turnosService.findOne(nuevo.id);
  }

  /**
   * GET /turnos         (y también /appointments)
   * Lista todos los turnos.
   * - El service ya los ordena por fecha/hora y trae el paciente relacionado.
   */
  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  /**
   * GET /turnos/:id     (y también /appointments/:id)
   * Busca un turno puntual por ID (numérico).
   * - ParseIntPipe fuerza que :id sea number (si no, responde 400).
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findOne(id);
  }

  /**
   * PUT /turnos/:id     (y también /appointments/:id)
   * Actualiza (reemplaza/cambia) datos de un turno.
   * - Usamos UpdateTurnoDto (todos los campos opcionales).
   * - PUT está pedido en el enunciado, así que lo incluimos explícito.
   */
  @Put(':id')
  updatePut(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  /**
   * PATCH /turnos/:id   (y también /appointments/:id)
   * Actualización parcial (mantener por compatibilidad con el front).
   * - También usa UpdateTurnoDto.
   */
  @Patch(':id')
  updatePatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTurnoDto: UpdateTurnoDto,
  ) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  /**
   * DELETE /turnos/:id  (y también /appointments/:id)
   * Elimina un turno por ID.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.remove(id);
  }
}
// -----------------------------------------------------------------------------
// 📌 Siguiente archivo recomendado para seguir:
// "backend-gestor/src/turnos/turnos.service.ts" → toda la lógica de negocio
// (crear/listar/actualizar/borrar turnos y helpers como findByPatient).
// -----------------------------------------------------------------------------