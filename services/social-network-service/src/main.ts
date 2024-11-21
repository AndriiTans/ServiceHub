import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { ProfileSeedService } from './profiles/profile.seed';

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

  const mongoose = await import('mongoose');
  mongoose.set('strictQuery', false);

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    Logger.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  await mongoose
    .connect(mongoUri)
    .then(() => Logger.log('MongoDB connection established successfully'))
    .catch((error) => Logger.error('Error connecting to MongoDB', error));

  // Get the ProfileSeedService from the app
  const profileSeedService = app.get(ProfileSeedService);
  const profileCount = await profileSeedService.getProfileCount();

  if (profileCount === 0) {
    Logger.log('Database is empty, running seed...');

    await profileSeedService.seed(); // Call the seed method here
    Logger.log('Seeding completed successfully.');
  } else {
    Logger.log('Data already exists, skipping seed.');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 social-network-service is running and listening on port - ${port}`);
}

bootstrap();
