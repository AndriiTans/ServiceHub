// app.ts or server.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import apiRoutes from './routes';
import logger from './utils/logger';

// dotenv.config(); // Load env

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

app.use('/', apiRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send({ message: 'An unexpected error occurred.' });
});

const startServer = async () => {
  try {
    console.log('connectDatabase - start');
    await connectDatabase();
    console.log('connectDatabase - end');
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
