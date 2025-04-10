"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Bell,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Gift,
  Home,
  LogOut,
  MapPin,
  Package,
  Settings,
  User,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import axios from "axios";

export default function NgoDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("available")
  const { toast } = useToast()

  // Mock data for donations
  const handleLogout = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/auth/logout`, {
          withCredentials: true,
        })
        router.push("/login")
      } catch (err) {
        console.error("Logout failed:", err)
      }
  }
  
  const availableDonations = [
    {
      id: "DON-005",
      date: "2023-05-20",
      donor: "John Doe",
      items: ["Clothes (8)", "Books (12)"],
      location: "123 Main St, Anytown",
      distance: "2.5 km",
      pickupDate: "2023-05-25",
      pickupTime: "Morning (9 AM - 12 PM)",
    },
    {
      id: "DON-006",
      date: "2023-05-19",
      donor: "Sarah Johnson",
      items: ["Food (5kg)", "Medicines"],
      location: "456 Oak Ave, Anytown",
      distance: "3.8 km",
      pickupDate: "ASAP",
    },
  ]

  const acceptedDonations = [
    {
      id: "DON-007",
      date: "2023-05-18",
      donor: "Michael Brown",
      items: ["Electronics (3)", "Books (20)"],
      location: "789 Pine St, Anytown",
      distance: "1.2 km",
      pickupDate: "2023-05-22",
      pickupTime: "Afternoon (12 PM - 3 PM)",
      status: "Scheduled",
      progress: 50,
    },
  ]

  const completedDonations = [
    {
      id: "DON-008",
      date: "2023-05-10",
      donor: "Emily Wilson",
      items: ["Clothes (15)", "Toys (10)"],
      location: "321 Elm St, Anytown",
      completedDate: "2023-05-12",
      beneficiaries: "Children's Shelter",
      progress: 100,
    },
  ]

  const handleAcceptDonation = (donationId: string) => {
    toast({
      title: "Donation Accepted",
      description: `You have accepted donation ${donationId}. Please arrange pickup.`,
    })

    // In a real app, this would update the state or make an API call
  }

  const handleRejectDonation = (donationId: string) => {
    toast({
      title: "Donation Rejected",
      description: `You have rejected donation ${donationId}.`,
    })

    // In a real app, this would update the state or make an API call
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Gift className="h-6 w-6 text-primary" />
            <span>DonateConnect</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/ngo/dashboard">
            <Button variant="secondary" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          {/* <Link href="/ngo/profile">
            <Button variant="ghost" className="w-full justify-start">
              <Building className="mr-2 h-4 w-4" />
              NGO Profile
            </Button>
          </Link>
          <Link href="/ngo/beneficiaries">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Beneficiaries
            </Button>
          </Link>
          <Link href="/ngo/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link> */}
        </nav>
        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="md:hidden flex items-center gap-2 font-bold">
            <Gift className="h-6 w-6 text-primary" />
            <span>DonateConnect</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/ngo/profile">
                <User className="mr-2 h-4 w-4" />
                Hope Foundation
              </Link>
            </Button>
          </div>
        </header>

        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">NGO Dashboard</h1>
              <p className="text-muted-foreground">Manage donation requests and track pickups</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{availableDonations.length}</div>
                <p className="text-xs text-muted-foreground">Donations waiting for your response</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Accepted Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{acceptedDonations.length}</div>
                <p className="text-xs text-muted-foreground">Donations scheduled for pickup</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedDonations.length}</div>
                <p className="text-xs text-muted-foreground">Successfully collected donations</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="available" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="available">Available Donations</TabsTrigger>
              <TabsTrigger value="accepted">Accepted Donations</TabsTrigger>
              <TabsTrigger value="completed">Completed Donations</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              {availableDonations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Package className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No available donations in your area</p>
                  </CardContent>
                </Card>
              ) : (
                availableDonations.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{donation.id}</CardTitle>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">New</span>
                      </div>
                      <CardDescription>Posted on {new Date(donation.date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Donor:</p>
                        <p className="text-sm">{donation.donor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {donation.items.map((item, i) => (
                            <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">{donation.location}</p>
                          <p className="text-xs text-muted-foreground">{donation.distance} away</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Pickup:{" "}
                          {donation.pickupDate === "ASAP"
                            ? "As soon as possible"
                            : `${new Date(donation.pickupDate).toLocaleDateString()} - ${donation.pickupTime}`}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button className="flex-1" onClick={() => handleAcceptDonation(donation.id)}>
                        Accept
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleRejectDonation(donation.id)}>
                        Decline
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {acceptedDonations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You don't have any accepted donations</p>
                  </CardContent>
                </Card>
              ) : (
                acceptedDonations.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{donation.id}</CardTitle>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {donation.status}
                        </span>
                      </div>
                      <CardDescription>Accepted on {new Date(donation.date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Donor:</p>
                        <p className="text-sm">{donation.donor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {donation.items.map((item, i) => (
                            <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">{donation.location}</p>
                          <p className="text-xs text-muted-foreground">{donation.distance} away</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Scheduled: {new Date(donation.pickupDate).toLocaleDateString()} - {donation.pickupTime}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{donation.progress}%</span>
                        </div>
                        <Progress value={donation.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button className="flex-1">Mark as Collected</Button>
                      <Button variant="outline" className="flex-1">
                        Contact Donor
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedDonations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You don't have any completed donations yet</p>
                  </CardContent>
                </Card>
              ) : (
                completedDonations.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{donation.id}</CardTitle>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                      </div>
                      <CardDescription>
                        Collected on {new Date(donation.completedDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Donor:</p>
                        <p className="text-sm">{donation.donor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {donation.items.map((item, i) => (
                            <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm">{donation.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Distributed to:</p>
                        <p className="text-sm">{donation.beneficiaries}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{donation.progress}%</span>
                        </div>
                        <Progress value={donation.progress} />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="secondary" className="flex-1">
                        Send Impact Report
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

