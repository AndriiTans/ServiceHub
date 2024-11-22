import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { plainToInstance } from 'class-transformer';
import { AddressResponseDto } from './dto/address-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IUser } from './interfaces/user.interface';
import { CustomerUpdateDto } from './dto/customer-update.dto';
import { CustomerCreateOrUpdateDto } from './dto/customer-create-or-update.dto';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllCustomers(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerService.getAllCustomers();

    if (customers.length > 0) {
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

    return [];
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
  async createOrUpdateCustomer(@Req() req, @Body() data: CustomerUpdateDto): Promise<Customer> {
    const user: IUser = req.user;

    const customerDto: CustomerCreateOrUpdateDto = {
      ...data,
      userId: user.id,
      email: user.email,
    };

    return this.customerService.createOrUpdateCustomer(customerDto);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: number,
    @Body() data: CustomerUpdateDto,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, data);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: number): Promise<boolean> {
    return this.customerService.deleteCustomer(id);
  }
}
