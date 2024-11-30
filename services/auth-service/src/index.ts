// import 'dotenv/config';
// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import { connectDatabase } from './config/database';
// import apiRoutes from './routes';
// import logger from './utils/logger';
// import serverlessExpress from '@vendia/serverless-express';

// const app = express();

// // Middleware setup
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(logger);

// // API routes
// app.use('/', apiRoutes);

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).send('OK');
// });

// // Global error handler
// app.use((err: Error, req: Request, res: Response, next: Function) => {
//   console.error(err.stack);
//   res.status(500).send({ message: 'An unexpected error occurred.' });
// });

// // Start the Express server locally (for local testing)
// const startServer = async () => {
//   try {
//     console.log('connectDatabase - start');
//     await connectDatabase();
//     console.log('connectDatabase - end');
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Error starting server:', error);
//   }
// };

// // Only start the server locally if not running in AWS Lambda
// if (process.env.NODE_ENV !== 'production') {
//   startServer();
// }

// // Lambda handler for AWS
// export const handler = async (event: any, context: any) => {
//   // Ensure database connection (optional for Lambda's cold starts)
//   await connectDatabase();

//   // Pass the event to the serverless adapter
//   const serverlessExpressInstance = serverlessExpress({ app });
//   return serverlessExpressInstance(event, context);
// };

exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Auth Service is working!' }),
  };
};
