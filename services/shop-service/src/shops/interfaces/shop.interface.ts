import { Customer } from 'src/customers/entities/customer.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';

export interface IShop {
  id: number;
  name: string;
  description: string;
  owner: Customer;
  products: Product[];
  income: number;
  isActive: boolean;
  rating: number;
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}
