import { IsNotEmpty, IsString } from 'class-validator';

export class CommentUpdateDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
