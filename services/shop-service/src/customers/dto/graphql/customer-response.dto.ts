import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { AddressResponseDto } from './address-response.dto';

@ObjectType()
export class CustomerResponseDto {
  @Field(() => Int)
  @Expose()
  id: number;

  @Field()
  @Expose()
  firstName: string;

  @Field()
  @Expose()
  email: string;

  @Field(() => AddressResponseDto, { nullable: true })
  @Expose()
  address?: AddressResponseDto;
}
