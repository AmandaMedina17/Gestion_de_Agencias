import { NestFactory } from "@nestjs/core";
import { AppModule } from "./Modules/AppModule";

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  
  // 🆕 Habilitar CORS
    app.enableCors({
      origin: 'http://localhost:3001', // o el puerto de tu frontend React
      credentials: true,
    });

   const port = process.env.PORT || 3000;
   await app.listen(port);
   console.log('Application is running on: http://localhost:3000');
}
bootstrap()
