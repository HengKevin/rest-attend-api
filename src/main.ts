import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Attendance API')
    .setDescription('The Attendance API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1', app, document);
  app.enableCors();
  const PORT = process.env.PORT || 5000
  await app.listen(PORT);
  console.log(`🚀 Server up on port: ${PORT} test`);
  
}
bootstrap();
