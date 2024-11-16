import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class AddressDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  street: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  state: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  country: string;
}
