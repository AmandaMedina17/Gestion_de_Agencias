// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './Modules/AppModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🆕 Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3001', // o el puerto de tu frontend React
    credentials: true,
  });
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();