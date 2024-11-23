import { IsString, IsNotEmpty } from 'class-validator';

export class ShopCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
