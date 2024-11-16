import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Shop } from 'src/shops/entities/shop.entity';
import { IProduct } from '../interfaces/product.interface';
import { Tag } from './tag.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Rating } from './rating.entity';

@Entity('products')
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Shop, (shop) => shop.products)
  shop: Shop;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.products, { cascade: ['remove'] })
  @JoinTable({ name: 'products_tags' })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.product, { cascade: true, onDelete: 'CASCADE' })
  ratings: Rating[];
}
