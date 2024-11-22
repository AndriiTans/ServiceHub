import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { IUser } from 'src/customers/interfaces/user.interface';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException('Authorization token is missing', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Send the token to the Auth Service for validation
      const response = await axios.get(`${AUTH_SERVICE_URL}/api/v1/users/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user, isValid }: { user: IUser; isValid: boolean } = response.data || {};

      if (!user || !isValid) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      request.user = user; // Attach user data to the request object

      return true;
    } catch (error) {
      // Check if the error is from the axios request or something else
      if (error.response) {
        throw new HttpException(
          error.response.data.message || 'Unauthorized',
          error.response.status,
        );
      }
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]; // Extract the token
    }
    return null;
  }
}
