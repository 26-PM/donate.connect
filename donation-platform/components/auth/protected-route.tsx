"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

interface DecodedToken {
  id: string
  type: string
  exp: number
}

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.replace("/login")
          return
        }

        // Decode token and check expiration
        const decoded = jwtDecode<DecodedToken>(token)
        const currentTime = Math.floor(Date.now() / 1000)
        
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem("token")
          router.replace("/login")
          return
        }

        // Check if user role is allowed
        if (!allowedRoles.includes(decoded.type)) {
          // User doesn't have required role
          router.replace("/")
          return
        }

        // Set default Authorization header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // User is authenticated and authorized
        setIsAuthorized(true)
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("token")
        router.replace("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, allowedRoles])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3">Authenticating...</p>
      </div>
    )
  }

  // Return children only if authorized
  return isAuthorized ? <>{children}</> : null
}