import { Expose } from 'class-transformer';

export class AddressResponseDto {
  @Expose()
  street: string;

  @Expose()
  postalCode: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  country: string;
}
