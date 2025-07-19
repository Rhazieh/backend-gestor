import { Module } from '@nestjs/common';
import { PacientesModule } from './pacientes/pacientes.module';


@Module({
  imports: [PacientesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
