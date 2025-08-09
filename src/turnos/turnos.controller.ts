// Controlador de Turnos
// 👉 Expone rutas en español Y alias en inglés.
//    - Español (actual):    /turnos
//    - Inglés (alias):      /appointments
// Sumo soporte de PUT y PATCH para cumplir el enunciado sin romper tu front.

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

// 👇 Mismo controller con dos prefijos: /turnos y /appointments
@Controller(['turnos', 'appointments'])
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  /**
   * POST /turnos        (y también /appointments)
   * Crea un nuevo turno. Devuelvo el turno con relaciones cargadas.
   */
  @Post()
  async create(@Body() createTurnoDto: CreateTurnoDto) {
    const nuevo = await this.turnosService.create(createTurnoDto);
    return this.turnosService.findOne(nuevo.id);
  }

  /**
   * GET /turnos         (y también /appointments)
   * Lista todos los turnos (ordenados por fecha y hora).
   */
  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  /**
   * GET /turnos/:id     (y también /appointments/:id)
   * Busca un turno puntual por ID.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnosService.findOne(id);
  }

  /**
   * PUT /turnos/:id     (y también /appointments/:id)
   * Actualiza el turno "reemplazando" campos (para el enunciado).
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
   * Actualización parcial — lo mantengo para compatibilidad.
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
