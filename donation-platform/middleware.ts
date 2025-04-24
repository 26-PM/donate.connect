import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: string
  type: string
  exp: number
}

export function middleware(request: NextRequest) {
  console.log('Cookie Header:', request.headers.get('cookie'));
  console.log('All Headers:', Object.fromEntries(request.headers));
  // Get token from either cookie or Authorization header
  const token = request.headers.get('Authorization')?.split(' ')[1] || 
                request.cookies.get('token')?.value
                
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/api']
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/api/') || path.startsWith('/_next/'))
  
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // If no token exists, redirect to login
  if (!token) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.headers.set('x-middleware-cache', 'no-cache')
    return response
  }
  
  try {
    // Decode and validate token
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    
    // Check if token has expired
    if (decoded.exp < currentTime) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }
    
    // Check correct role for the path
    const donorPaths = ['/donor']
    const ngoPaths = ['/ngo']
    
    const isDonorPath = donorPaths.some(prefix => path.startsWith(prefix))
    const isNgoPath = ngoPaths.some(prefix => path.startsWith(prefix))
    
    if (isDonorPath && decoded.type !== 'user') {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }
    
    if (isNgoPath && decoded.type !== 'ngo') {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }

    // Clone the request headers and add the token
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token}`)
    requestHeaders.set('x-middleware-cache', 'no-cache')

    // Return the response with modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Add security headers
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('x-middleware-cache', 'no-cache')
    
    return response
  } catch (error) {
    // If token is invalid, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.headers.set('x-middleware-cache', 'no-cache')
    return response
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}