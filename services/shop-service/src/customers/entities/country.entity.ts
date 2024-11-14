import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ICity } from '../interfaces/city.interface';
import { State } from './state.entity';
import { ICountry } from '../interfaces/country.interface';
import { City } from './city.entity';

@Entity('countries')
export class Country implements ICountry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => State, (state) => state.country)
  states: State[];

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
