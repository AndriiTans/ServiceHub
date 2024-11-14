import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Address } from './entities/address.entity';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';

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
  ) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: ['address', 'address.city', 'address.state', 'address.country'],
    });

    // return this.customerRepository
    // .createQueryBuilder('customer')
    // .leftJoinAndSelect('customer.address', 'address')
    // .leftJoinAndSelect('address.city', 'city')
    // .leftJoinAndSelect('address.state', 'state')
    // .leftJoinAndSelect('address.country', 'country')
    // .getMany();
  }

  async getCustomerById(id: number): Promise<Customer> {
    return this.customerRepository.findOne({
      where: { id },
      relations: ['address', 'address.city', 'address.state', 'address.country'],
    });
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(data);
    return this.customerRepository.save(customer);
  }

  async createCustomerWithFullAddress(data: any): Promise<Customer> {
    // Create or find the country
    let country = await this.countryRepository.findOne({
      where: { name: data.address.country.name },
    });
    if (!country) {
      country = this.countryRepository.create({ name: data.address.country.name });
      country = await this.countryRepository.save(country);
    }

    // Create or find the state
    let state = await this.stateRepository.findOne({ where: { name: data.address.state.name } });
    if (!state) {
      state = this.stateRepository.create({ name: data.address.state.name, country });
      state = await this.stateRepository.save(state);
    }

    // Create or find the city
    let city = await this.cityRepository.findOne({ where: { name: data.address.city.name } });
    if (!city) {
      city = this.cityRepository.create({ name: data.address.city.name, state, country });
      city = await this.cityRepository.save(city);
    }

    // Create the address
    const address = this.addressRepository.create({
      street: data.address.street,
      postalCode: data.address.postalCode,
      city,
      state,
      country,
    });
    const savedAddress = await this.addressRepository.save(address);

    // Create the customer with the address
    const customer = this.customerRepository.create({
      userId: data.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      role: data.role,
      address: savedAddress,
    });

    return this.customerRepository.save(customer);
  }

  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, data);
    return this.getCustomerById(id);
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
