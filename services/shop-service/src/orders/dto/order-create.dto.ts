import { IsInt, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemCreateDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

export class OrderItemCreateInputDto {
  productId: number;
  quantity: number;
  price: number;
}

export class OrderCreateInputDto {
  totalAmount: number;
  items: OrderItemCreateInputDto[];
}

export class OrderCreateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemCreateDto)
  items: OrderItemCreateDto[];
}
