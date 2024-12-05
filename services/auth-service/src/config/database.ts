import mongoose from 'mongoose';

const mongoUri = process.env.AUTH_SERVICE_MONGO_URI;

export const connectDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
};
