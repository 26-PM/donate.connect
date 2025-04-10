"use client"

import Link from "next/link"
import { ArrowRight, Gift, Package, Clock, MapPin, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DonorHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-10">
        <section className="mb-12">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Welcome, Donor!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Ready to make a difference? Start your donation journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col">
              <CardHeader>
                <Package className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Start a New Donation</CardTitle>
                <CardDescription>Select items you want to donate and find NGOs that need them</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">
                  Choose from categories like food, clothes, books, and more. Add details and photos of your items.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Donate Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Track Your Donations</CardTitle>
                <CardDescription>Monitor the status of your ongoing donations</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">
                  See which NGOs have accepted your donations, schedule pickup times, and track delivery status.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Active Donations
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Donation History</CardTitle>
                <CardDescription>Review your past donations and their impact</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">
                  See all your completed donations, read thank you notes from NGOs, and view impact reports.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View History
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Donation Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: "Food", icon: "🥗" },
              { name: "Clothes", icon: "👕" },
              { name: "Books", icon: "📚" },
              { name: "Medicines", icon: "💊" },
              { name: "Electronics", icon: "📱" },
              { name: "Others", icon: "📦" },
            ].map((category, index) => (
              <Card key={index} className="text-center hover:border-primary cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Nearby NGOs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Hope Foundation",
                distance: "2.5 km",
                needs: ["Food", "Clothes", "Books"],
                address: "123 Charity St, Helptown",
              },
              {
                name: "Green Earth Initiative",
                distance: "4.1 km",
                needs: ["Electronics", "Books"],
                address: "456 Green Ave, Ecoville",
              },
              {
                name: "Care for All",
                distance: "5.8 km",
                needs: ["Medicines", "Food", "Clothes"],
                address: "789 Care Blvd, Supportville",
              },
            ].map((ngo, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{ngo.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {ngo.distance} away
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Currently Needs:</p>
                    <div className="flex flex-wrap gap-2">
                      {ngo.needs.map((need, i) => (
                        <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{ngo.address}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

