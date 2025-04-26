import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/customers/enums/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('You must be logged in to access this resource.');
    }

    if (user.role !== UserRole.Admin) {
      throw new ForbiddenException(
        'You do not have the necessary permissions to access this resource.',
      );
    }

    return true;
  }
}
