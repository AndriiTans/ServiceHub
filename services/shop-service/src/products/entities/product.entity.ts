import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
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

  @Column({ type: 'varchar', length: 150, nullable: true })
  imageName: string;

  @ManyToOne(() => Shop, (shop) => shop.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.products, { cascade: ['remove'] })
  @JoinTable({ name: 'products_tags' })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.product, { cascade: true })
  ratings: Rating[];

  get imageUrl(): string {
    if (!this.imageName) {
      return null;
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:3003';
    return `${baseUrl}/uploads/${this.imageName}`;
  }
}
