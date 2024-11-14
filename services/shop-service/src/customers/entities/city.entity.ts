import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ICity } from '../interfaces/city.interface';
import { State } from './state.entity';
import { Country } from './country.entity';

@Entity('cities')
export class City implements ICity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
