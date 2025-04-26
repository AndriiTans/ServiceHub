import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsInt()
  @IsOptional()
  parentCommentId?: number;
}
