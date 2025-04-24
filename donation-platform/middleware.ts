import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: string
  type: string
  exp: number
}

export function middleware(request: NextRequest) {
  const token =
    request.headers.get('Authorization')?.split(' ')[1] || // Check Bearer token
    request.cookies.get('token')?.value                    // Check cookie token

  const path = request.nextUrl.pathname

  // Define public routes
  const publicPaths = ['/', '/login', '/signup']
  const isPublicPath =
    publicPaths.includes(path) || path.startsWith('/api/') || path.startsWith('/_next/')

  // Allow public routes
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If token not found, redirect to login
  if (!token) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.headers.set('x-middleware-cache', 'no-cache')
    return response
  }

  try {
    // Decode and validate token
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Math.floor(Date.now() / 1000)

    if (decoded.exp < currentTime) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }

    // Role-based access control
    const isDonorPath = path.startsWith('/donor')
    const isNgoPath = path.startsWith('/ngo')

    if (isDonorPath && !['donor', 'user'].includes(decoded.type)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isNgoPath && decoded.type !== 'ngo') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Pass headers along with the request
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token}`)
    requestHeaders.set('x-middleware-cache', 'no-cache')

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('x-middleware-cache', 'no-cache')

    return response
  } catch (error) {
    console.error('Invalid token:', error)
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.headers.set('x-middleware-cache', 'no-cache')
    return response
  }
}

// Middleware route matcher
export const config = {
  matcher: [
    // Apply to all paths except static files and public API routes
    '/((?!_next/static|_next/image|favicon.ico|assets|api/public).*)',
  ],
}
