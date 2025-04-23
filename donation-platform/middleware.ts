import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: string
  type: string
  exp: number
}

export function middleware(request: NextRequest) {
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
    const donorPaths = ['/donor']
    const ngoPaths = ['/ngo']
    
    const isDonorPath = donorPaths.some(prefix => path.startsWith(prefix))
    const isNgoPath = ngoPaths.some(prefix => path.startsWith(prefix))
    
    if (isDonorPath && decoded.type !== 'user') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (isNgoPath && decoded.type !== 'ngo') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Clone the request headers and add the token
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token}`)

    // Return the response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}