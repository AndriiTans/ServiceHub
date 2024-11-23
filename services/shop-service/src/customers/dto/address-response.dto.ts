import { Expose, Type } from 'class-transformer';

export class CityResponseDto {
  @Expose()
  name: string;
}

export class StateResponseDto {
  @Expose()
  name: string;
}

export class CountryResponseDto {
  @Expose()
  name: string;
}

export class AddressResponseDto {
  @Expose()
  street: string;

  @Expose()
  postalCode: string;

  @Expose()
  @Type(() => CityResponseDto)
  city: CityResponseDto;

  @Expose()
  @Type(() => StateResponseDto)
  state: StateResponseDto;

  @Expose()
  @Type(() => CountryResponseDto)
  country: CountryResponseDto;
}
