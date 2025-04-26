import { IsString, IsNotEmpty } from 'class-validator';

export class TagCreateOrUpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
