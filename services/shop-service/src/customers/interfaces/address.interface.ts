import { City } from '../entities/city.entity';
import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';

export interface IAddress {
  id: number;
  street: string;
  postalCode: string;
  city: City;
  state: State;
  country: Country;
}
