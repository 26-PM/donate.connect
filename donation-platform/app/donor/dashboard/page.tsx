"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Gift,
  Package,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("pending")

  const pendingDonations = [
    {
      id: "DON-001",
      date: "2023-05-15",
      items: ["Clothes (5)", "Books (10)"],
      ngo: "Hope Foundation",
      status: "Awaiting Response",
      progress: 25,
    },
    {
      id: "DON-002",
      date: "2023-05-18",
      items: ["Food (2kg)", "Medicines"],
      ngo: "Care for All",
      status: "Accepted & Scheduled",
      pickupDate: "2023-05-25",
      pickupTime: "10:00 AM - 12:00 PM",
      progress: 50,
    },
  ]

  const completedDonations = [
    {
      id: "DON-003",
      date: "2023-04-10",
      items: ["Electronics (2)", "Books (15)"],
      ngo: "Green Earth Initiative",
      completedDate: "2023-04-15",
      impact: "Helped 5 students with educational materials",
      progress: 100,
    },
    {
      id: "DON-004",
      date: "2023-03-22",
      items: ["Clothes (10)", "Food (5kg)"],
      ngo: "Hope Foundation",
      completedDate: "2023-03-25",
      impact: "Supported 3 families with essential supplies",
      progress: 100,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donation Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your donations</p>
        </div>
        <Button className="mt-4 md:mt-0" asChild>
          <Link href="/donate">
            <Gift className="mr-2 h-4 w-4" />
            Start New Donation
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {pendingDonations.length + completedDonations.length}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingDonations.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting pickup or NGO response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedDonations.length}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered to NGOs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Donations</TabsTrigger>
          <TabsTrigger value="completed">Completed Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingDonations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Package className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You don't have any pending donations</p>
                <Button asChild>
                  <Link href="/donate">Start a Donation</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            pendingDonations.map((donation) => (
              <Card key={donation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{donation.id}</CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        donation.status === "Awaiting Response"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>
                  <CardDescription>Created on {new Date(donation.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <div>
                    <p className="text-sm font-medium mb-1">NGO:</p>
                    <p className="text-sm">{donation.ngo}</p>
                  </div>
                  {donation.pickupDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Pickup on {new Date(donation.pickupDate).toLocaleDateString()} at {donation.pickupTime}
                      </span>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{donation.progress}%</span>
                    </div>
                    <Progress value={donation.progress} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
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
                    Donated on {new Date(donation.completedDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <div>
                    <p className="text-sm font-medium mb-1">NGO:</p>
                    <p className="text-sm">{donation.ngo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Impact:</p>
                    <p className="text-sm">{donation.impact}</p>
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
                    Leave Feedback
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}