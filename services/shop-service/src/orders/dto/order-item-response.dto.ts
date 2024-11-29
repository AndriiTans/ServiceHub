import { Expose, Type } from 'class-transformer';
import { OrderResponseDto } from './order-response.dto';
import { ProductResponseDto } from 'src/products/dto/product-response.dto';

export class OrderItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => OrderResponseDto)
  order: OrderResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;

  @Expose()
  quantity: number;

  @Expose()
  price: number;
}
