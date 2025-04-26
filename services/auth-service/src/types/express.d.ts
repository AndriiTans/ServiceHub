import { User } from '../models';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
