import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../services/userService';

const userService = new UserService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1] || req.body.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

    const user = await userService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token version' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authorization error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token has expired' });
    }

    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};
