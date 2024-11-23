import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { IRating } from '../interfaces/rating.interface';

@Entity('ratings')
export class Rating implements IRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 1 })
  score: number;

  @ManyToOne(() => Product, (product) => product.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.ratings)
  author: Customer;
}
