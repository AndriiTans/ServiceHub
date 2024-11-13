import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

interface User {
  userId: number;
  email: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const response = await axios.get<{ isValid; user: User }>(
      `${AUTH_SERVICE_URL}/api/v1/users/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { isValid, user } = response.data;

    if (!isValid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
