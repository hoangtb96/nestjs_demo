import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CustomLogger } from './common/services/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  
  const logger = new CustomLogger();
  logger.setContext('Bootstrap');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    transform: true, // Transform payloads to be objects typed according to their DTO classes
    forbidNonWhitelisted: true, // Throw errors when non-whitelisted properties are present
    transformOptions: {
      enableImplicitConversion: true, // Automatically transform query parameters to their correct types
    },
  }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(new CustomLogger()));

  const config = new DocumentBuilder()
    .setTitle('Location Service API')
    .setDescription('API documentation for the Location Service')
    .setVersion('1.0')
    .addTag('locations', 'Location management endpoints')
    .addTag('buildings', 'Building management endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
