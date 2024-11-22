import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { Address } from './entities/address.entity';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { CustomerResolver } from './customer.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Address, City, State, Country]),
    forwardRef(() => SharedModule), // Use forwardRef here as well
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerResolver],
  exports: [TypeOrmModule, CustomerService],
})
export class CustomerModule {}
