import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { IComment } from '../interfaces/comment.interface';

@Entity('comments')
export class Comment implements IComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Product, (product) => product.comments, { nullable: false })
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.comments, { nullable: false })
  author: Customer;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];
}
