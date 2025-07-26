import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

// Este controlador se encarga de manejar todas las rutas HTTP que tienen que ver con turnos.
// Solamente recibe las peticiones (como GET, POST, etc) y se las pasa al servicio que hace la lógica real.
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  // POST /turnos
  // Crea un turno nuevo. El cuerpo del request tiene que venir con los datos correctos (validados por el DTO).
  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  // GET /turnos
  // Devuelve todos los turnos guardados en la base de datos.
  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  // GET /turnos/:id
  // Trae un turno puntual por su ID (lo convertimos a número con +id porque viene como string).
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(+id);
  }

  // PATCH /turnos/:id
  // Actualiza un turno específico. Se puede modificar solo una parte (no hace falta mandar todo).
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(+id, updateTurnoDto);
  }

  // DELETE /turnos/:id
  // Elimina un turno por ID.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }
}