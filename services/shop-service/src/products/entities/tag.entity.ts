import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ITag } from '../interfaces/tag.interface';

@Entity('tags')
export class Tag implements ITag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
