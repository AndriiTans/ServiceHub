import { Address } from '../entities/address.entity';
import { UserRole } from '../enums/role.enum';

export interface ICustomer {
  id: number;
  userId: number;
  email: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}
