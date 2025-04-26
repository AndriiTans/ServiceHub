import { City } from '../entities/city.entity';
import { State } from '../entities/state.entity';

export interface ICountry {
  id: number;
  name: string;
  states: State[];
  cities: City[];
}
