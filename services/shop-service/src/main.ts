import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppDataSource } from './config/data-source';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import serverlessExpress from '@vendia/serverless-express';

let server: any; // Holds the serverlessExpress instance for reuse

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Reject requests with unknown properties
      transform: true, // Transform payloads to match DTO types
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // await AppDataSource.initialize()
  //   .then(() => Logger.log('Data Source has been initialized!'))
  //   .catch((error) => Logger.error('Error during Data Source initialization', error));

  // const customerCount = await AppDataSource.manager.count('customers');
  // if (customerCount === 0) {
  //   Logger.log('Database is empty, running seed...');
  //   await seed();
  //   Logger.log('Seeding completed successfully.');
  // } else {
  //   Logger.log('Data already exists, skipping seed.');
  // }

  return app;
}

// Local development bootstrap
async function bootstrap() {
  const app = await createApp();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 shop-service is running and listening on port - ${port}`);
}

// Lambda handler
export const handler = async (event: any, context: any) => {
  if (!server) {
    const app = await createApp();
    await app.init(); // Ensures NestJS lifecycle hooks are triggered
    server = serverlessExpress({ app: app.getHttpAdapter().getInstance() });
  }
  return server(event, context);
};

// Run locally if not in a Lambda environment
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
