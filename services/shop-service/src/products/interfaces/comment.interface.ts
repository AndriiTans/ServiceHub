import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Comment } from '../entities/comment.entity';

export class IComment {
  id: number;
  message: string;
  product: Product;
  author: Customer;
  parentComment: Comment;
  replies: Comment[];
}
