import helmet from 'helmet';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from './app.module';
import { AppDataSource } from './config/data-source';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express';

let server: Handler; // Holds the serverlessExpress instance for reuse

// async function createApp() {
//   const app = await NestFactory.create(AppModule);

//   app.setGlobalPrefix('v1', {
//     exclude: [{ path: 'health', method: RequestMethod.GET }],
//   });

//   app.use(
//     helmet({
//       contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
//     }),
//   );

//   app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

//   app.useGlobalInterceptors(new LoggingInterceptor());

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true, // Strip unknown properties
//       forbidNonWhitelisted: true, // Reject requests with unknown properties
//       transform: true, // Transform payloads to match DTO types
//     }),
//   );

//   app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

//   await AppDataSource.initialize()
//     .then(() => Logger.log('Data Source has been initialized!'))
//     .catch((error) => Logger.error('Error during Data Source initialization', error));

//   // const customerCount = await AppDataSource.manager.count('customers');
//   // if (customerCount === 0) {
//   //   Logger.log('Database is empty, running seed...');
//   //   await seed();
//   //   Logger.log('Seeding completed successfully.');
//   // } else {
//   //   Logger.log('Data already exists, skipping seed.');
//   // }

//   return app;
// }

// Local development bootstrap
// async function bootstrap() {
//   const app = await createApp();

//   const port = process.env.PORT || 3000;
//   await app.listen(port);

//   Logger.log(`🚀 shop-service is running and listening on port - ${port}`);
// }

async function createApp(expressApp: express.Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

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

  return app;
}

async function bootstrapServerless(): Promise<Handler> {
  console.log('express');
  console.log('express -> ', express);
  console.log('express');
  const expressApp = express();
  const nestApp = await createApp(expressApp);

  console.log('bootstrapServerless');
  await nestApp.init();
  console.log('await app.init();');
  return serverlessExpress({ app: expressApp });
}

// if (process.env.NODE_ENV === 'dev') {
//   bootstrap();
// }

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrapServerless());
  return server(event, context, callback);
};
