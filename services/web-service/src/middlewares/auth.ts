import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function authMiddleware(req: NextRequest) {
  //   const token = req.cookies.get('authToken');
  const token = localStorage.get('authToken');

  console.log('token ', token);

  // If no token is found, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Proceed if authenticated
  return NextResponse.next();
}
