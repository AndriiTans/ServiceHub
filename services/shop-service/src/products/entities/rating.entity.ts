import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { IRating } from '../interfaces/rating.interface';

@Entity('ratings')
@Unique(['author', 'product'])
export class Rating implements IRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    default: 1,
    transformer: {
      to(value: number): number {
        return value > 5 ? 5 : value < 1 ? 1 : value;
      },
      from(value: number): number {
        return value;
      },
    },
  })
  score: number;

  @Column({ type: 'text' })
  comment: string;

  @ManyToOne(() => Product, (product) => product.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.ratings)
  author: Customer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
