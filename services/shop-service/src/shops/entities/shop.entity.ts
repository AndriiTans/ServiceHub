import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { IShop } from '../interfaces/shop.interface';
import { Product } from 'src/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('shops')
export class Shop implements IShop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  description: string;

  @OneToOne(() => Customer, (customer) => customer.shop, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: Customer;

  @OneToMany(() => Product, (product) => product.shop, { cascade: true })
  products: Product[];

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'int' })
  income: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.shop, { cascade: true })
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
