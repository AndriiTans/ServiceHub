import { Customer } from 'src/customers/entities/customer.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../enums/order-status';
import { Shop } from 'src/shops/entities/shop.entity';

export class IOrder {
  id: number;
  customer: Customer;
  totalAmount: number;
  isPaid: boolean;
  status: OrderStatus;
  shop: Shop;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}
