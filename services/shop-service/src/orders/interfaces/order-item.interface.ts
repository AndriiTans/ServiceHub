import { Product } from 'src/products/entities/product.entity';
import { Order } from '../entities/order.entity';

export interface IOrderItem {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
  price: number;
}
