import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryCreateOrUpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
