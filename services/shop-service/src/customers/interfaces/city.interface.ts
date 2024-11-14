import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';

export interface ICity {
  id: number;
  name: string;
  state: State;
  country: Country;
}
