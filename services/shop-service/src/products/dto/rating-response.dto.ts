import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto } from 'src/customers/dto/customer-response.dto';
import { ProductResponseDto } from './product-response.dto';

export class RatingResponseDto {
  @Expose()
  id: number;

  @Expose()
  score: number;

  @Expose()
  comment: string;
  @Expose()
  @Type(() => CustomerResponseDto)
  author: CustomerResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
