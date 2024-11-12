import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
