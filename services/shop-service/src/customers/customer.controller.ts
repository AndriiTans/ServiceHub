import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { plainToInstance } from 'class-transformer';
import { AddressResponseDto } from './dto/address-response.dto';
import { CustomerCreateFullAddressDto } from './dto/customer-create.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
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

  @Get(':id')
  async getCustomerById(@Param('id') id: number): Promise<CustomerResponseDto> {
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

  @Post()
  async createCustomer(@Body() data: Partial<Customer>): Promise<Customer> {
    return this.customerService.createCustomer(data);
  }

  @Post('full-address')
  async createCustomerWithFullAddress(
    @Body() data: CustomerCreateFullAddressDto,
  ): Promise<Customer> {
    return this.customerService.createCustomerWithFullAddress(data);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: number,
    @Body() data: Partial<Customer>,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, data);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: number): Promise<void> {
    return this.customerService.deleteCustomer(id);
  }
}
