import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '';

  // Define allowed origins
  const allowedOrigins = [
    'https://donateconnect-kye5bxpmj-26-pms-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      },
    });
  }

  // Create the response
  const response = NextResponse.next();

  // Add the CORS headers for actual requests
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');

  return response;
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: '/api/:path*',
}; 