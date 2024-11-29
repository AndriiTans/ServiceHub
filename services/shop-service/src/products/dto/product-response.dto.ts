import { Expose, Type } from 'class-transformer';
import { ShopResponseDto } from 'src/shops/dto/shop-response.dto';
import { CategoryResponseDto } from './category-response.dto';
import { TagResponseDto } from './tag-response.dto';
import { CommentResponseDto } from './comment-response.dto';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  imageUrl: string;

  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;

  @Expose()
  @Type(() => ShopResponseDto)
  shop: ShopResponseDto;

  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];

  @Expose()
  @Type(() => CommentResponseDto)
  comments: CommentResponseDto[];

  //   @Expose()
  //   @Type(() => RatingResponseDto)
  //   ratings: RatingResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
