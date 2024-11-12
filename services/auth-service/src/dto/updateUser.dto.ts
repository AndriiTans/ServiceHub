import { IsEmail, IsString, Length, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
