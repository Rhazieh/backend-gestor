// Importa el decorador @Controller y otros decoradores para manejar rutas y parámetros HTTP.
// Estos decoradores indican a NestJS qué hacer cuando se recibe una petición en cierta ruta y con cierto método.
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

// Importa el servicio de pacientes, que contiene toda la lógica de negocio.
import { PacientesService } from './pacientes.service';

// Importa el DTO para crear pacientes (Data Transfer Object).
// Define y valida qué datos se necesitan al crear un nuevo paciente.
import { CreatePacienteDto } from './dto/create-paciente.dto';

// Importa el DTO para actualizar pacientes.
// Permite recibir datos parciales para modificar solo lo necesario.
import { UpdatePacienteDto } from './dto/update-paciente.dto';

/**
 * @Controller('pacientes'):
 * Define que todas las rutas de este controlador comenzarán con "/pacientes".
 * Ejemplo: GET /pacientes, POST /pacientes, GET /pacientes/:id, etc.
 */
@Controller('pacientes')
export class PacientesController {
  /**
   * Inyección de dependencias:
   * - Recibimos una instancia de PacientesService automáticamente.
   * - Esto nos permite llamar a la lógica definida en el servicio sin crearlo manualmente.
   */
  constructor(private readonly pacientesService: PacientesService) {}

  /**
   * @Post():
   * Maneja las peticiones POST a "/pacientes".
   * - @Body() extrae el cuerpo de la petición (JSON enviado por el cliente).
   * - createPacienteDto contiene los datos validados según CreatePacienteDto.
   * - Llama al método create() del servicio para guardar el nuevo paciente.
   */
  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  /**
   * @Get():
   * Maneja las peticiones GET a "/pacientes".
   * - No recibe parámetros.
   * - Devuelve todos los pacientes almacenados en la base de datos.
   */
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  /**
   * @Get(':id'):
   * Maneja las peticiones GET a "/pacientes/:id".
   * - @Param('id') extrae el valor ":id" de la URL.
   * - Los parámetros de la URL llegan como string, por eso convertimos con +id a número.
   * - Devuelve un solo paciente que coincida con ese ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(+id);
  }

  /**
   * @Patch(':id'):
   * Maneja las peticiones PATCH a "/pacientes/:id".
   * - @Param('id') obtiene el ID desde la URL.
   * - @Body() obtiene los datos a modificar (pueden ser campos parciales).
   * - Llama al método update() del servicio para actualizar los datos del paciente.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(+id, updatePacienteDto);
  }

  /**
   * @Delete(':id'):
   * Maneja las peticiones DELETE a "/pacientes/:id".
   * - Elimina el paciente con el ID indicado.
   * - El método remove() del servicio se encarga de la operación.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(+id);
  }
}