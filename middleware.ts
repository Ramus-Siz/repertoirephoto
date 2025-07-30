import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('token cookie =', req.cookies.get('token')?.value);
  return NextResponse.next();
}
