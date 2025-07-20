import { NestFactory } from '@nestjs/core'; // Esto permite crear una instancia de tu app Nest
import { AppModule } from './app.module';    // Importamos el módulo principal que ya configuramos (con DB, módulos, etc.)

// Esta función se ejecuta apenas arranca la app
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Creamos la app a partir del módulo principal

  // Le decimos en qué puerto va a escuchar (si hay variable de entorno PORT la usa, sino por defecto 3000)
  await app.listen(process.env.PORT ?? 3000);
}

// Ejecutamos la función para que arranque el servidor
bootstrap();