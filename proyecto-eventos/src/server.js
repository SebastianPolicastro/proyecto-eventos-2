import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

try {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${env.PORT} (${env.NODE_ENV})`);
  });
} catch (error) {
  console.error('No se pudo conectar a MongoDB:', error.message);
  process.exit(1);
}
