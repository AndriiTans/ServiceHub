import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerService.getAllCustomers();
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: number): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Post()
  async createCustomer(@Body() data: Partial<Customer>): Promise<Customer> {
    return this.customerService.createCustomer(data);
  }

  @Post('full-address')
  async createCustomerWithFullAddress(@Body() data: any): Promise<Customer> {
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
