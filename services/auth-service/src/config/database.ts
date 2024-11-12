import { DataSource } from 'typeorm';
import { User } from '../models/user.model';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true, // Set to true for development to auto-create tables
  logging: false,
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.synchronize();

    console.log(
      'Loaded entities after initialization:',
      AppDataSource.entityMetadatas.map((meta) => meta.name),
    );
    console.log('Data Source has been initialized and synchronized!');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
  }
};
