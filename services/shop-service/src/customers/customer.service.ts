import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Address } from './entities/address.entity';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { CustomerCreateFullAddressDto } from './dto/customer-create.dto';
import { AddressDto } from './dto/address-create.dto';
import { TypeOrmHelperService } from 'src/shared/typeorm-helper.service';
import { CustomerSyncDto } from './dto/customer-sync.dto';
import { CustomerUpdateDto } from './dto/customer-update.dto';
import { CustomerCreateOrUpdateDto } from './dto/customer-create-or-update.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly typeOrmHelperService: TypeOrmHelperService,
  ) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: ['address', 'address.city', 'address.state', 'address.country'],
    });
  }

  async getCustomerById(id: number): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id },
        relations: ['address', 'address.city', 'address.state', 'address.country'],
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found.`);
      }

      return customer;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while fetching the customer.');
    }
  }

  async getCustomerByUserId(userId: string): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findOne({
        where: { userId },
        relations: ['address', 'address.city', 'address.state', 'address.country'],
      });

      if (!customer) {
        throw new NotFoundException(`Customer with userId ${userId} not found.`);
      }

      return customer;
    } catch (error) {
      console.error(`Error fetching customer with userId ${userId}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while fetching the customer.');
    }
  }

  async createOrUpdateCustomer(data: CustomerCreateOrUpdateDto): Promise<Customer> {
    try {
      const { userId, email, ...otherUserData } = data;

      if (!userId) {
        throw new BadRequestException('userId is required and cannot be undefined.');
      }

      const customer = await this.customerRepository.findOne({ where: { userId } });
      if (!customer) {
        return await this.createCustomer({ userId, email, ...data });
      }

      return await this.updateCustomer(customer.id, { ...otherUserData });
    } catch (error) {
      console.error('Error in createOrUpdateCustomer:', error);
      throw new InternalServerErrorException('Failed to create or update customer.');
    }
  }

  async syncCustomer(userId: string, data: CustomerSyncDto): Promise<Customer> {
    try {
      const existingCustomer = await this.customerRepository.findOne({ where: { userId } });
      if (!existingCustomer) {
        throw new NotFoundException(`Customer with userId ${userId} not found.`);
      }

      Object.assign(existingCustomer, data);

      return await this.customerRepository.save(existingCustomer);
    } catch (error) {
      console.error('Error syncing customer:', error);
      throw new InternalServerErrorException('Failed to sync customer.');
    }
  }

  async createCustomer(data: CustomerCreateFullAddressDto): Promise<Customer> {
    try {
      const customer = this.customerRepository.create({
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });

      const savedCustomer = await this.customerRepository.save(customer);

      if (data?.address) {
        await this.createOrUpdateAddress(data.address, savedCustomer);
      }

      return savedCustomer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw new InternalServerErrorException('Failed to create customer.');
    }
  }

  async updateCustomer(id: number, data: CustomerUpdateDto): Promise<Customer> {
    try {
      const existingCustomer = await this.customerRepository.findOne({
        where: { id },
      });

      if (!existingCustomer) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }

      const address = await this.addressRepository.findOne({
        where: { customer: { id: existingCustomer.id } },
      });

      const { address: addressUpdateDto, ...customerUpdateDto } = data;

      if (data.address) {
        await this.createOrUpdateAddress(addressUpdateDto, existingCustomer, address);
      }

      Object.assign(existingCustomer, customerUpdateDto);

      return this.customerRepository.save(existingCustomer);
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw new InternalServerErrorException('Failed to update customer.');
    }
  }

  async updateCustomerByUserId(userId: string, data: CustomerUpdateDto): Promise<Customer> {
    try {
      const existingCustomer = await this.customerRepository.findOne({
        where: { userId },
      });

      if (!existingCustomer) {
        throw new NotFoundException(`Customer with userId ${userId} not found`);
      }

      const address = await this.addressRepository.findOne({
        where: { customer: { id: existingCustomer.id } },
      });

      const { address: addressUpdateDto, ...customerUpdateDto } = data;

      if (data.address) {
        await this.createOrUpdateAddress(addressUpdateDto, existingCustomer, address);
      }

      Object.assign(existingCustomer, customerUpdateDto);

      return this.customerRepository.save(existingCustomer);
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw new InternalServerErrorException('Failed to update customer.', error.message);
    }
  }

  private async createOrUpdateAddress(
    addressDto: AddressDto,
    customer: Customer,
    existingAddress?: Address,
  ): Promise<Address> {
    try {
      const country = await this.typeOrmHelperService.findOrCreate(
        this.countryRepository,
        { name: addressDto.country },
        { name: addressDto.country },
      );
      const state = await this.typeOrmHelperService.findOrCreate(
        this.stateRepository,
        { name: addressDto.state },
        { name: addressDto.state, country },
      );
      const city = await this.typeOrmHelperService.findOrCreate(
        this.cityRepository,
        { name: addressDto.city },
        { name: addressDto.city, state, country },
      );

      const addressData = {
        ...existingAddress,
        street: addressDto.street,
        postalCode: addressDto.postalCode,
        city,
        state,
        country,
        // customer,
      };

      if (existingAddress) {
        return this.addressRepository.save(addressData);
      } else {
        addressData.customer = customer;

        return this.addressRepository.save(this.addressRepository.create(addressData));
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to create or update address.');
    }
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['address'],
    });

    if (customer) {
      await this.customerRepository.remove(customer);
      return true;
    }

    return false;
  }
}
