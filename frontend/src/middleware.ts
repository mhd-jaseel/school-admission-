import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Runs on Edge runtime to inspect request paths.
// Since token is saved in LocalStorage, actual deep validation is handled on the client-side within components.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configures paths that this middleware intercepts.
export const config = {
  matcher: ['/parent/:path*', '/admission/:path*'],
};
