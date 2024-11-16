import { ObjectType, Field } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class AddressResponseDto {
  @Field()
  @Expose()
  street: string;

  @Field()
  @Expose()
  postalCode: string;

  @Field()
  @Expose()
  city: string;

  @Field()
  @Expose()
  state: string;

  @Field()
  @Expose()
  country: string;
}
