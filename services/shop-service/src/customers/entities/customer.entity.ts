import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { ICustomer } from '../interfaces/customer.interface';
import { Address } from './address.entity';
import { UserRole } from '../enums/role.enum';
import { Shop } from 'src/shops/entities/shop.entity';
import { Comment } from 'src/products/entities/comment.entity';
import { Rating } from 'src/products/entities/rating.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('customers')
export class Customer implements ICustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  userId: string;

  @Column({ type: 'varchar', unique: true, length: 150 })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Member,
  })
  role?: UserRole;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phoneNumber: string;

  @OneToOne(() => Address, (address) => address.customer, {
    nullable: true,
    cascade: true,
  })
  address: Address;

  @OneToOne(() => Shop, (shop) => shop.owner, {
    nullable: true,
    cascade: true,
  })
  shop: Shop;

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.author)
  ratings: Rating[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
