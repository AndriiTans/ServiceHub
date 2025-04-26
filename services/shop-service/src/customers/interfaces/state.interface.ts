import { City } from '../entities/city.entity';

export interface IState {
  id: number;
  name: string;
  cities: City[];
}
