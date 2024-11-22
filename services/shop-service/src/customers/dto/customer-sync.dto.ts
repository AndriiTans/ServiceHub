import { IsEmail, IsNotEmpty } from 'class-validator';

export class CustomerSyncDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;
}
