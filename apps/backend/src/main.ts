import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validations piped
  app.useGlobalPipes(new ValidationPipe());

  // Configure global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  //   {
  //   origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  //   allowedHeaders: 'Content-Type, Accept',
  // }
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Set up global validation pipe
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('PR Contact Management API')
    .setDescription('API for managing PR contacts and their relationships')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start the server
  const port = process.env.PORT ?? 3333;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

void bootstrap();

export default bootstrap;