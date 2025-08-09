import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- agregar

async function iniciarApp() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Valida DTOs en TODAS las rutas, limpia campos extra y transforma tipos básicos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}
iniciarApp();
