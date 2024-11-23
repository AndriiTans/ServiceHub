import { Request } from 'express';
import { IUser } from 'src/customers/interfaces/user.interface';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}
