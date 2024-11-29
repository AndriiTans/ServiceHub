import { Expose, Type } from 'class-transformer';
import { AddressResponseDto } from './address-response.dto';

export class CustomerResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => AddressResponseDto)
  address: AddressResponseDto;
}
