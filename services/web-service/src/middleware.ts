import { composeMiddleware } from './middlewares/composeMiddleware';
import { authMiddleware } from './middlewares/auth';
import { loggingMiddleware } from './middlewares/logging';
import { errorHandlingMiddleware } from './middlewares/errorHandling';
import type { NextRequest } from 'next/server';

// Use composeMiddleware to combine all middlewares
const composedMiddleware = composeMiddleware(
  loggingMiddleware, // Logs all requests
  errorHandlingMiddleware, // Handles errors
  authMiddleware, // Protects authenticated routes
);

// Export the middleware function
export async function middleware(req: NextRequest) {
  return composedMiddleware(req);
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/product/create', '/product/update', '/api/secure-route', '/auth/login'],
};
