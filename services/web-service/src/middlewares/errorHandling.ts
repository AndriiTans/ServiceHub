/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function errorHandlingMiddleware(req: NextRequest) {
  try {
    // Simulate an error for demonstration
    if (req.nextUrl.pathname === '/cause-error') {
      throw new Error('Simulated error');
    }

    return NextResponse.next();
  } catch (error: any) {
    console.error(`[ERROR] ${error.message}`);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
