import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose({ name: '_id' })
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  tokenVersion: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
