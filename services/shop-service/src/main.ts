import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable built-in HTTP logging
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  const port = process.env.PORT;
  await app.listen(port);

  Logger.log(`🚀 shop-service is running and listening on port - ${port}`);
}

bootstrap();
