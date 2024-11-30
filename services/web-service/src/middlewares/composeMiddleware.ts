import { NextRequest, NextResponse } from 'next/server';

type MiddlewareFunction = (req: NextRequest) => NextResponse | Promise<NextResponse> | undefined;

export function composeMiddleware(...middlewares: MiddlewareFunction[]) {
  return async function (req: NextRequest) {
    for (const middleware of middlewares) {
      const response = await middleware(req);
      if (response) {
        // If a middleware returns a response, stop the chain and return it
        return response;
      }
    }
    return NextResponse.next(); // Continue to the requested route
  };
}
