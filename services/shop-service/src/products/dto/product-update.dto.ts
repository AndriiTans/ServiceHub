import { IsString, IsDecimal, IsInt, IsOptional, IsArray } from 'class-validator';

export class ProductUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  price: number;

  @IsInt()
  @IsOptional()
  categoryId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[];
}
