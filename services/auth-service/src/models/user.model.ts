import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column()
  name: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ default: 0 })
  tokenVersion: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
