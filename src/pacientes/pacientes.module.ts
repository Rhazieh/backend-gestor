
// Importa el decorador @Module para definir un módulo en NestJS.
// Un módulo es como una "caja" que agrupa funcionalidades relacionadas:
// en este caso, todo lo que tiene que ver con pacientes.
import { Module } from '@nestjs/common';

// Importa TypeOrmModule para poder trabajar con la base de datos usando TypeORM.
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa el servicio de pacientes, que contiene la lógica de negocio
// (crear, buscar, actualizar, eliminar pacientes).
import { PacientesService } from './pacientes.service';

// Importa el controlador de pacientes, que define las rutas HTTP
// (GET, POST, PUT, DELETE) y recibe las peticiones del cliente.
import { PacientesController } from './pacientes.controller';

// Importa la entidad Paciente, que es la representación en código
// de la tabla "pacientes" en la base de datos.
import { Paciente } from './entities/paciente.entity';

// Definimos el módulo de pacientes.
@Module({
  /**
   * imports:
   * - TypeOrmModule.forFeature([Paciente]):
   *   Registra la entidad Paciente en este módulo para que TypeORM
   *   pueda crear automáticamente un repositorio asociado.
   *   Esto nos permite inyectar `Repository<Paciente>` en el servicio
   *   y hacer consultas sin escribir SQL manualmente.
   */
  imports: [TypeOrmModule.forFeature([Paciente])],

  /**
   * controllers:
   * - Lista de controladores que pertenecen a este módulo.
   *   En este caso, PacientesController maneja las rutas y llama al servicio
   *   para ejecutar la lógica necesaria.
   */
  controllers: [PacientesController],

  /**
   * providers:
   * - Lista de servicios o clases que se pueden inyectar como dependencias.
   *   PacientesService es el encargado de toda la lógica relacionada a pacientes.
   */
  providers: [PacientesService],
})
// Exportamos el módulo para que pueda ser importado en AppModule u otros módulos si es necesario.
export class PacientesModule {}