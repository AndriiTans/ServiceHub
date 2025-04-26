import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto } from 'src/customers/dto/customer-response.dto';
import { ShopResponseDto } from 'src/shops/dto/shop-response.dto';
import { OrderStatus } from '../enums/order-status';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => CustomerResponseDto)
  customer: CustomerResponseDto;

  @Expose()
  totalAmount: number;

  @Expose()
  isPaid: boolean;

  @Expose()
  status: OrderStatus;

  @Expose()
  @Type(() => ShopResponseDto)
  shop: ShopResponseDto;

  @Expose()
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
