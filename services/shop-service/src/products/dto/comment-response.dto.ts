import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto } from 'src/customers/dto/customer-response.dto';
import { ProductResponseDto } from './product-response.dto';

export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  message: string;

  @Expose()
  @Type(() => CustomerResponseDto)
  author: CustomerResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;

  @Expose()
  @Type(() => CommentResponseDto)
  parentComment: CommentResponseDto;

  @Expose()
  @Type(() => CommentResponseDto)
  replies: CommentResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
