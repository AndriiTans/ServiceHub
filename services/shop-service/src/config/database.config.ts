import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Define and export TypeORM configuration
export const DatabaseConfig: TypeOrmModuleOptions = {
  // Specify MySQL as the database type
  type: 'mysql',

  // Connection settings from environment variables
  host: process.env.SHOP_SERVICE_DB_HOST || 'localhost',
  port: parseInt(process.env.SHOP_SERVICE_DB_PORT || '3306', 10),
  username: process.env.SHOP_SERVICE_DB_USER || 'root',
  password: process.env.SHOP_SERVICE_DB_PASSWORD || 'password',
  database: process.env.SHOP_SERVICE_DB_NAME || 'shopdb',

  // Specify the location of the entities (models)
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  // Synchronize the database schema (use only in development)
  synchronize: process.env.TYPEORM_SYNC === 'true',

  // Enable logging for SQL queries if specified in the environment
  logging: process.env.TYPEORM_LOGGING === 'true',

  // Specify the location of the migrations
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  // Automatically run migrations on startup
  migrationsRun: true,

  // Set the character set for Unicode support
  charset: 'utf8mb4_unicode_ci',
};
