import * as dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/shop',
  jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
  logLevel: process.env.LOG_LEVEL || 'info',
  apiPrefix: process.env.API_PREFIX || '/api',
};
