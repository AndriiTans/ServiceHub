import { Request, Response, NextFunction } from 'express';

function logger(req: Request, res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.url}`);
  next();
}

export default logger;
