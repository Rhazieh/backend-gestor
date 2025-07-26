import { NestFactory } from '@nestjs/core'; // Importamos lo necesario para crear la app NestJS
import { AppModule } from './app.module';    // Importamos el módulo principal donde está todo configurado (DB, módulos, etc.)

// Esta función arranca automáticamente cuando inicia el backend
async function iniciarApp() {
  // Creamos la app usando el módulo principal (AppModule)
  const app = await NestFactory.create(AppModule);

  // Le indicamos en qué puerto tiene que correr el backend:
  // Si existe la variable de entorno PORT, la usa. Si no, usa el 3000 por defecto.
  await app.listen(process.env.PORT ?? 3000);
}

// Ejecutamos la función para que arranque el servidor
iniciarApp();