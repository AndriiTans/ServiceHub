import { Customer } from 'src/customers/entities/customer.entity';

export class ShopCreateInputDto {
  name: string;
  description: string;
  owner: Customer;
}
