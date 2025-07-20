import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

// Este controlador se encarga de manejar todas las rutas relacionadas a los turnos.
// Lo que hace es recibir las peticiones (por ejemplo, cuando alguien manda un POST o un GET),
// y se las pasa al servicio (TurnosService), que es donde realmente se hace la lógica.
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  // Cuando se hace un POST a /turnos, este método se activa.
  // Recibe los datos del turno por el body y se los pasa al servicio para crear el turno.
  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  // Este método devuelve todos los turnos registrados.
  // Se activa al hacer un GET a /turnos.
  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  // Este busca un turno específico según su ID.
  // Por ejemplo, GET /turnos/5 devuelve el turno con ID 5.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(+id); // Se transforma el ID a número con +id
  }

  // Este método se usa para actualizar los datos de un turno ya creado.
  // Recibe el ID por parámetro y los datos nuevos por el body.
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(+id, updateTurnoDto);
  }

  // Esta ruta elimina un turno según su ID.
  // DELETE /turnos/3 eliminaría el turno con ID 3.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }
}