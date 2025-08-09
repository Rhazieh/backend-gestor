	// Importa la función principal para iniciar una aplicación NestJS.
// NestFactory es como el "motor de arranque" que crea la instancia de la app.
import { NestFactory } from '@nestjs/core';

// Importa el módulo raíz de la aplicación, donde se registran todos los módulos, controladores y servicios.
import { AppModule } from './app.module';

// Función asíncrona que inicializa el servidor backend.
// Se usa async/await porque la creación de la app y el inicio del servidor son procesos asíncronos.
async function iniciarApp() {
  /**
   * Crea la instancia de la aplicación NestJS a partir del módulo principal.
   * - El segundo parámetro { cors: true } habilita CORS (Cross-Origin Resource Sharing),
   *   permitiendo que el frontend pueda hacer peticiones a este backend
   *   aunque esté en un dominio o puerto diferente.
   */
  const app = await NestFactory.create(AppModule, { cors: true });

  /**
   * Inicia el servidor HTTP en el puerto indicado:
   * - Si existe la variable de entorno PORT (por ejemplo, en Render o Heroku),
   *   se usa ese valor.
   * - Si no existe, se usa el puerto 3000 por defecto.
   * process.env.PORT devuelve undefined si no está configurada.
   * El operador ?? devuelve el valor de la derecha (3000) solo si el de la izquierda es null o undefined.
   */
  await app.listen(process.env.PORT ?? 3000);
}

// Llama a la función para iniciar el servidor.
// Sin esta línea, el backend no se ejecutaría.
iniciarApp();