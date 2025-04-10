"use client"

import Link from "next/link"
import { Home, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Button size="sm" asChild variant="ghost">
            <Link href="/donor/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/donor/ngos">
              <Gift className="mr-2 h-4 w-4" />
              New Donation
            </Link>
          </Button>
        </div>
      </header>

      <main className="p-6">
        {/* Dashboard content goes here */}
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Click "New Donation" to get started
          </p>
        </div>
      </main>
    </div>
  )
}
