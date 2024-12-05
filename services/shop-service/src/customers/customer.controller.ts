import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { plainToInstance } from 'class-transformer';
import { AddressResponseDto } from './dto/address-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IUser } from './interfaces/user.interface';
import { CustomerUpdateDto } from './dto/customer-update.dto';
import { CustomerCreateOrUpdateDto } from './dto/customer-create-or-update.dto';
import { AdminOrOwnershipGuard } from 'src/common/guards/admin-or-ownership.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllCustomers(): Promise<CustomerResponseDto[]> {
    try {
      const customers = await this.customerService.getAllCustomers();

      return plainToInstance(CustomerResponseDto, customers, { excludeExtraneousValues: true });
    } catch (error) {
      throw new HttpException('Failed to fetch customers.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: number): Promise<CustomerResponseDto> {
    try {
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
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch the customer.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createOrUpdateCustomer(
    @Req() req: AuthenticatedRequest,
    @Body() data: CustomerUpdateDto,
  ): Promise<Customer> {
    try {
      const user: IUser = req.user;

      const customerDto: CustomerCreateOrUpdateDto = {
        ...data,
        userId: user._id,
        email: user.email,
      };

      return await this.customerService.createOrUpdateCustomer(customerDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create or update customer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  async updateCustomerByUserId(
    @Req() req: AuthenticatedRequest,
    @Body() data: CustomerUpdateDto,
  ): Promise<Customer> {
    try {
      const user: IUser = req.user;

      return await this.customerService.updateCustomerByUserId(user._id, data);
    } catch (error) {
      throw new HttpException('Failed to update the customer.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseGuards(AdminOrOwnershipGuard)
  async updateCustomer(
    @Param('id') id: number,
    @Body() data: CustomerUpdateDto,
  ): Promise<Customer> {
    try {
      return await this.customerService.updateCustomer(id, data);
    } catch (error) {
      throw new HttpException('Failed to update the customer.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(AdminOrOwnershipGuard)
  async deleteCustomer(@Param('id') id: number): Promise<boolean> {
    try {
      return await this.customerService.deleteCustomer(id);
    } catch (error) {
      throw new HttpException('Failed to delete the customer.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
