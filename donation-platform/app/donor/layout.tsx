"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Gift, Home, LogOut, Package, User, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import DonorRoute from "@/components/auth/donor-route"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  id: string
  type: string
  exp: number
}

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DonorRoute>
      <DonorLayoutContent>{children}</DonorLayoutContent>
    </DonorRoute>
  )
}

function DonorLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40 h-screen sticky top-0">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Gift className="h-6 w-6 text-primary" />
            <span>DonateConnect</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/donor/home">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/donor/dashboard">
            <Button 
              variant={pathname === "/donor/dashboard" ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <Package className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/donor/ngos">
            <Button 
              variant={pathname === "/donor/ngos" ? "secondary" : "ghost"} 
              className="w-full justify-start"
            >
              <Users className="mr-2 h-4 w-4" />
              All NGOs
            </Button>
          </Link>
        </nav>
        <div className="border-t p-4 sticky bottom-0 bg-muted/40">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
} 