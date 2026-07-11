import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

// Boots up the NestJS framework, registers global middlewares (CORS, prefix, pipes), and binds to the port.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const allowedOriginsStr = configService.get<string>('ALLOWED_ORIGINS');
  const allowedOrigins = allowedOriginsStr
    ? allowedOriginsStr.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'https://school-admission-sigma.vercel.app'];

  // Enable CORS so the frontend can securely make API queries.
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Prefixes all URL routes with /api (e.g. /api/auth/login), excluding the root path.
  app.setGlobalPrefix('api', { exclude: ['/'] });

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
