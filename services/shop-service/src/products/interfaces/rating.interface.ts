import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/customers/entities/customer.entity';

export class IRating {
  id: number;
  score: number;
  product: Product;
  author: Customer;
}
