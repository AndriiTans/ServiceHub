import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class CustomerDataGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.firstName || !user.lastName || !user.address) {
      throw new HttpException(
        'Please complete your profile with first name, last name, and address.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
