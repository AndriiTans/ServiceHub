import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { City } from './city.entity';
import { State } from './state.entity';
import { Country } from './country.entity';
import { IAddress } from '../interfaces/address.interface';

@Entity('addresses')
export class Address implements IAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  street: string;

  @Column({ type: 'varchar', length: 20 })
  postalCode: string;

  @ManyToOne(() => City, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => State, { nullable: false })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => Country, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
