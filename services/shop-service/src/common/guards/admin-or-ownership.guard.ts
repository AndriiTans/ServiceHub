import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { OwnershipGuard } from './ownership.guard';

@Injectable()
export class AdminOrOwnershipGuard implements CanActivate {
  constructor(
    private readonly adminGuard: AdminGuard,
    private readonly ownershipGuard: OwnershipGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isAdmin = false;
    let isOwner = false;

    try {
      isAdmin = await this.adminGuard.canActivate(context);
    } catch (err) {
      console.log('AdminGuard failed:', err.message);
    }

    try {
      isOwner = await this.ownershipGuard.canActivate(context);
    } catch (err) {
      console.log('OwnershipGuard failed:', err.message);
    }

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'Access denied. You must be an admin or the owner of this resource.',
      );
    }

    return true;
  }
}
