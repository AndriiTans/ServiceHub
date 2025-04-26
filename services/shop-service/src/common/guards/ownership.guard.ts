import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { CustomerService } from 'src/customers/customer.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly customerService: CustomerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user; // User from AuthGuard

    const customerId = parseInt(request.params.id, 10); // ID from route params

    if (!user) {
      throw new ForbiddenException('You must be logged in to access this resource.');
    }

    const customer = await this.customerService.getCustomerById(customerId);

    if (!customer) {
      throw new ForbiddenException('Customer not found.');
    }

    if (customer.userId !== user.id) {
      throw new ForbiddenException('You do not own this resource.');
    }

    return true;
  }
}
