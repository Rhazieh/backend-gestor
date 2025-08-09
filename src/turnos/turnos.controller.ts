// Importa decoradores de NestJS para definir el controlador y manejar rutas HTTP.
// - @Controller: Define el prefijo de ruta para todas las acciones de este controlador.
// - @Get, @Post, @Patch, @Delete: Definen métodos HTTP específicos.
// - @Body, @Param: Extraen datos del cuerpo de la petición o de la URL.
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

// Importa el servicio de turnos, que contiene la lógica de negocio real.
import { TurnosService } from './turnos.service';

// Importa el DTO que define los datos necesarios para crear un turno.
import { CreateTurnoDto } from './dto/create-turno.dto';

// Importa el DTO que define los datos que se pueden actualizar en un turno.
import { UpdateTurnoDto } from './dto/update-turno.dto';

/**
 * @Controller('turnos'):
 * - Define que todas las rutas aquí empezarán con "/turnos".
 * - Ejemplo: GET /turnos, POST /turnos, GET /turnos/:id, etc.
 */
@Controller('turnos')
export class TurnosController {
  /**
   * Inyección de dependencias:
   * - NestJS crea automáticamente una instancia de TurnosService y la pasa aquí.
   * - Esto nos permite acceder a la lógica de negocio sin crear manualmente el servicio.
   */
  constructor(private readonly turnosService: TurnosService) {}

  /**
   * POST /turnos
   * - Crea un nuevo turno.
   * - @Body() extrae los datos enviados en el cuerpo de la petición y los valida según CreateTurnoDto.
   * - Luego de crearlo, lo buscamos de nuevo con findOne() para devolverlo con las relaciones cargadas
   *   (por ejemplo, el paciente asociado).
   */
  @Post()
  async create(@Body() createTurnoDto: CreateTurnoDto) {
    const nuevo = await this.turnosService.create(createTurnoDto);
    return this.turnosService.findOne(nuevo.id);
  }

  /**
   * GET /turnos
   * - Devuelve todos los turnos almacenados.
   * - El servicio se encarga de traer también la información de pacientes asociados.
   */
  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  /**
   * GET /turnos/:id
   * - Busca un turno específico por su ID.
   * - @Param('id') obtiene el valor del parámetro de la URL.
   * - Convertimos el id a número con +id porque los parámetros llegan como strings.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(+id);
  }

  /**
   * PATCH /turnos/:id
   * - Actualiza un turno existente por su ID.
   * - @Body() recibe datos parciales definidos en UpdateTurnoDto.
   * - Se pueden modificar solo algunos campos sin necesidad de enviar todos.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(+id, updateTurnoDto);
  }

  /**
   * DELETE /turnos/:id
   * - Elimina un turno por su ID.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }
}