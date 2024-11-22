import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { seed } from './seed';
import { AppDataSource } from './config/data-source';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  console.log(process.env.TYPEORM_SYNC);
  console.log(process.env.TYPEORM_LOGGING);

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Reject requests with unknown properties
      transform: true, // Transform payloads to match DTO types
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  await AppDataSource.initialize()
    .then(() => Logger.log('Data Source has been initialized!'))
    .catch((error) => Logger.error('Error during Data Source initialization', error));

  // const customerCount = await AppDataSource.manager.count('customers');
  // if (customerCount === 0) {
  //   Logger.log('Database is empty, running seed...');
  //   await seed();
  //   Logger.log('Seeding completed successfully.');
  // } else {
  //   Logger.log('Data already exists, skipping seed.');
  // }

  const port = process.env.PORT;
  await app.listen(port);

  Logger.log(`🚀 shop-service is running and listening on port - ${port}`);
}

bootstrap();
