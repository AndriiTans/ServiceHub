import { Entity } from 'typeorm';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity('ratings')
export class RatingCreateOrUpdateDto {
  @IsInt()
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
