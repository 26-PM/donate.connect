import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: string
  type: 'donor' | 'ngo' | 'user'
  exp: number
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1]
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/api']
  const isPublicPath = publicPaths.some(publicPath => path === publicPath || path.startsWith('/api/'))
  
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // If no token exists, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
    // Decode and validate token
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    
    // Check if token has expired
    if (decoded.exp < currentTime) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check correct role for the path
    const isDonorPath = path.startsWith('/donor')
    const isNgoPath = path.startsWith('/ngo')
    
    // For donor routes, check if user is a donor
    if (isDonorPath && decoded.type !== 'user' && decoded.type !== 'donor') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // For NGO routes, check if user is an NGO
    if (isNgoPath && decoded.type !== 'ngo') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // User is authenticated and has correct role
    return NextResponse.next()
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except static files and api
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 