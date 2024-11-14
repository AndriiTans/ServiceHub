import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { Address } from './entities/address.entity';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';

@Module({
  // Import TypeORM module for Customer and Address entities
  imports: [TypeOrmModule.forFeature([Customer, Address, City, State, Country])],

  // Register the controller to handle HTTP requests for Customer
  controllers: [CustomerController],

  // Provide the CustomerService to be injected where needed
  providers: [CustomerService],

  // Export CustomerService to make it available for other modules
  exports: [CustomerService],
})
export class CustomerModule {}
