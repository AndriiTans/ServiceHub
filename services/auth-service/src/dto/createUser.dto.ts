import { IsEmail, IsOptional, IsString, Length, IsEnum } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string; // Make password optional for Google users

  @IsEnum(['local', 'google'])
  authMethod: 'local' | 'google'; // Ensure we track the authentication method

  @IsOptional()
  @IsString()
  googleId?: string; // Store Google ID for Google-authenticated users
}
