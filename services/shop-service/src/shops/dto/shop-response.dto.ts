import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto } from 'src/customers/dto/customer-response.dto';
import { Customer } from 'src/customers/entities/customer.entity';

export class ShopResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  rating: number;

  @Expose()
  income: number;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => CustomerResponseDto)
  owner: CustomerResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
