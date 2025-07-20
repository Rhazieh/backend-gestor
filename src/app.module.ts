import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PacientesModule } from './pacientes/pacientes.module';
import { Paciente } from './pacientes/entities/paciente.entity';
import { TurnosModule } from './turnos/turnos.module';
import { Turno } from './turnos/entities/turno.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Paciente, Turno],
      synchronize: true,
    }),
    PacientesModule,
    TurnosModule,
  ],
  controllers: [],
  providers: [],
})
//test 
export class AppModule {}
