import {
  IsInt,
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InputType, Field } from '@nestjs/graphql';
import { AddressDto } from './address-create.dto';

@InputType()
export class CustomerCreateFullAddressDto {
  @Field()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Field()
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Field(() => AddressDto, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
