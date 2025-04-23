import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: string
  type: string
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
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  try {
    // Decode and validate token
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Math.floor(Date.now() / 1000)
    
    // Check if token has expired
    if (decoded.exp < currentTime) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
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
    
    return NextResponse.next()
  } catch (error) {
    // If token is invalid, redirect to login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}