"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Gift, Mail } from "lucide-react"
import { jwtDecode } from "jwt-decode"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

interface DecodedToken {
  id: string
  type: 'donor' | 'ngo' | 'user'
  exp: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Start with loading
  const { toast } = useToast()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            // Validate token by decoding
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Check if token is expired
            if (decoded.exp > currentTime) {
              // Token not expired, verify with backend
              try {
                const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
                  headers: { 
                    'Authorization': `Bearer ${token}` 
                  },
                  withCredentials: true
                });
                
                if (response.data.success) {
                  // User is authenticated, redirect based on user type
                  if (decoded.type === "user" || decoded.type === "donor") {
                    router.push("/donor/dashboard");
                    return;
                  } else if (decoded.type === "ngo") {
                    router.push("/ngo/dashboard");
                    return;
                  }
                }
              } catch (verifyError) {
                console.error("Token verification failed:", verifyError);
                // Clear invalid token
                localStorage.removeItem('token');
              }
            } else {
              // Token expired, remove from storage
              localStorage.removeItem('token');
            }
          } catch (decodeError) {
            console.error("Token decode error:", decodeError);
            // Invalid token format, remove it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
  
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
  
    const loginData = { email, password }
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData, {
        withCredentials: true,
      })

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })  
      

      // Redirect based on role
      if (response.data.type === "user") {
        router.push("/donor/dashboard")
      } else if (response.data.type === "ngo") {
        router.push("/ngo/dashboard")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      console.error('Login Error:', error)
      toast({
        title: "Login failed",
        description:
          error?.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    }
  
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Google login successful",
        description: "Redirecting to your dashboard...",
      })

      router.push("/donor/dashboard")
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "An error occurred during Google login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Gift className="h-6 w-6 text-primary" />
            <span>DonateConnect</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M17.13 17.13v-4.26h-4.26M6.87 6.87v4.26h4.26" />
              </svg>
              Google
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
