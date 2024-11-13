import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes';
import logger from './utils/logger';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger);

app.use('/api', apiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
