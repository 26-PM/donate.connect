"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Gift,
  Package,
  CheckCircle,
} from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"

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

interface Donation {
  _id: string;
  items: Array<{
    itemName: string;
    quantity: number;
    description: string;
    images: Array<{
      url: string;
      analysis: string;
    }>;
  }>;
  ngo: {
    name: string;
  };
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
  pickupOption: "scheduled" | "asap";
  pickupDate?: string;
  pickupTime?: string;
  createdAt: string;
  completedDate?: string;
}

interface DecodedToken {
  id: string
  type: string
  iat: number
  exp: number
}

export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("pending")
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const decodedToken = jwtDecode<DecodedToken>(token)
        const userId = decodedToken.id

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/user/${userId}`
        )

        console.log('Donations:', response.data.data)
        setDonations(response.data.data)
      } catch (error) {
        console.error('Error fetching donations:', error)
        toast({
          title: "Error",
          description: "Failed to fetch donations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonations()
  }, [toast, router])

  const pendingDonations = donations.filter(d => d.status === "Pending" || d.status === "Accepted")
  const completedDonations = donations.filter(d => d.status === "Completed")

  if (isLoading) {
    return <div>Loading...</div>
  }

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
            <div className="text-3xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">All your donations</p>
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
              <Card key={donation._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>DON-{donation._id.slice(-4)}</CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        donation.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>
                  <CardDescription>Created on {new Date(donation.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {donation.items.map((item, i) => (
                        <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full">
                          {item.quantity} {item.itemName}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">NGO:</p>
                    <p className="text-sm">{donation.ngo.name}</p>
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
                      <span>{donation.status === "Pending" ? "25%" : "50%"}</span>
                    </div>
                    <Progress value={donation.status === "Pending" ? 25 : 50} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/donor/donations/${donation._id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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
              <Card key={donation._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>DON-{donation._id.slice(-4)}</CardTitle>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>
                  </div>
                  <CardDescription>
                    Completed on {new Date(donation.completedDate || donation.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {donation.items.map((item, i) => (
                        <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full">
                          {item.quantity} {item.itemName}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">NGO:</p>
                    <p className="text-sm">{donation.ngo.name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/donor/donations/${donation._id}`}>
                      View Details
                    </Link>
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