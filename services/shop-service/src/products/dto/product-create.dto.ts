import { IsString, IsNotEmpty, IsDecimal, IsInt, IsOptional, IsArray } from 'class-validator';

export class ProductCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number; // Optional category ID

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[]; // Optional array of tag IDs
}
