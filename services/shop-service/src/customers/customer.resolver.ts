// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CustomerService } from './customer.service';
import { CustomerResponseDto } from './dto/graphql/customer-response.dto';
import { CustomerCreateFullAddressDto } from './dto/graphql/customer-create.dto';
import { AddressResponseDto } from './dto/graphql/address-response.dto';

@Resolver(() => CustomerResponseDto)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [CustomerResponseDto])
  async getAllCustomers(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerService.getAllCustomers();

    return customers.map((customer) => {
      const addressDto = plainToInstance(
        AddressResponseDto,
        {
          street: customer.address?.street,
          postalCode: customer.address?.postalCode,
          city: customer.address?.city?.name,
          state: customer.address?.state?.name,
          country: customer.address?.country?.name,
        },
        { excludeExtraneousValues: true },
      );

      return plainToInstance(
        CustomerResponseDto,
        {
          id: customer.id,
          firstName: customer.firstName,
          email: customer.email,
          address: addressDto,
        },
        { excludeExtraneousValues: true },
      );
    });
  }

  @Query(() => CustomerResponseDto)
  async getCustomerById(@Args('id', { type: () => Int }) id: number): Promise<CustomerResponseDto> {
    const customer = await this.customerService.getCustomerById(id);

    const addressDto = plainToInstance(AddressResponseDto, {
      street: customer.address.street,
      postalCode: customer.address.postalCode,
      city: customer.address.city.name,
      state: customer.address.state.name,
      country: customer.address.country.name,
    });

    return plainToInstance(CustomerResponseDto, {
      id: customer.id,
      firstName: customer.firstName,
      email: customer.email,
      address: addressDto,
    });
  }

  @Mutation(() => CustomerResponseDto)
  async createCustomer(
    @Args('data', { type: () => CustomerCreateFullAddressDto }) data: CustomerCreateFullAddressDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.createCustomer(data);
    return plainToInstance(CustomerResponseDto, customer, { excludeExtraneousValues: true });
  }

  @Mutation(() => Boolean)
  async deleteCustomer(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.customerService.deleteCustomer(id);
    return true;
  }
}
