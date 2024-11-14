import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { seed } from './seed';
import { AppDataSource } from './config/data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.use(helmet());

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  console.log(process.env.TYPEORM_SYNC);
  console.log(process.env.TYPEORM_LOGGING);
  await AppDataSource.initialize()
    .then(() => Logger.log('Data Source has been initialized!'))
    .catch((error) => Logger.error('Error during Data Source initialization', error));

  const customerCount = await AppDataSource.manager.count('customers');
  if (customerCount === 0) {
    Logger.log('Database is empty, running seed...');
    await seed();
    Logger.log('Seeding completed successfully.');
  } else {
    Logger.log('Data already exists, skipping seed.');
  }

  const port = process.env.PORT;
  await app.listen(port);

  Logger.log(`🚀 shop-service is running and listening on port - ${port}`);
}

bootstrap();
