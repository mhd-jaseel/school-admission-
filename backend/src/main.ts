import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Boots up the NestJS framework, registers global middlewares (CORS, prefix, pipes), and binds to the port.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the Next.js frontend (running on port 3000) can securely make API queries.
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Prefixes all URL routes with /api (e.g. /api/auth/login).
  app.setGlobalPrefix('api');

  // Enforces global request validation and auto-transforms input payloads based on class-validator decorators in DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
