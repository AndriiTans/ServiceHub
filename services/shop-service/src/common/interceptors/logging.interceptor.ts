import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    // Extracting details from the request
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    console.log(`[${method}] ${url} - Before handling request...`);

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`[${method}] ${url} - After handling request... ${Date.now() - now}ms`),
        ),
      );
  }
}
