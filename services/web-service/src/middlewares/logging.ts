import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function loggingMiddleware(req: NextRequest) {
  console.log(`[LOG] ${req.method} ${req.nextUrl.pathname} - ${new Date().toISOString()}`);
  return NextResponse.next();
}
