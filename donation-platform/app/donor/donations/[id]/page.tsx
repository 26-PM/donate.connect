"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, MapPin, Package, User, CheckCircle, Truck, Box } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { jwtDecode } from "jwt-decode"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

interface DonationItem {
  itemName: string
  quantity: number
  description: string
  images: Array<{
    url: string
    analysis: string
  }>
}

interface Donation {
  _id: string
  ngo: {
    _id: string
    name: string
  }
  items: DonationItem[]
  pickupAddress: string
  pickupOption: string
  pickupDate: string | null
  pickupTime: string | null
  status: string
  createdAt: string
}

interface DecodedToken {
  id: string
  type: string
  iat: number
  exp: number
}

export default function DonationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view donation details",
            variant: "destructive",
          })
          router.push('/login')
          return
        }

        const decodedToken = jwtDecode<DecodedToken>(token)
        const userId = decodedToken.id

        console.log('Fetching donation:', {
          donationId: params.id,
          userId: userId,
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/${params.id}/${userId}`
        })

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/${params.id}/${userId}`
        )

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch donation')
        }

        console.log('API Response:', response.data)
        setDonation(response.data.data)
      } catch (error: any) {
        console.error("Error fetching donation details:", {
          error: error.message,
          response: error.response?.data,
          status: error.response?.status
        })

        let errorMessage = "Failed to fetch donation details"
        if (error.response?.status === 404) {
          errorMessage = "Donation not found. It may have been deleted or you may have the wrong link."
        } else if (error.response?.status === 403) {
          errorMessage = "You are not authorized to view this donation."
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonationDetails()
  }, [params.id, toast, router])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          color: "bg-yellow-500",
          progress: 25,
          icon: Package,
          description: "Waiting for NGO approval"
        }
      case "Accepted":
        return {
          color: "bg-blue-500",
          progress: 50,
          icon: Truck,
          description: "Pickup scheduled"
        }
      case "Completed":
        return {
          color: "bg-green-500",
          progress: 100,
          icon: CheckCircle,
          description: "Successfully delivered"
        }
      default:
        return {
          color: "bg-gray-500",
          progress: 0,
          icon: Box,
          description: "Status unknown"
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-40 bg-muted rounded"></div>
                <div className="h-40 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Donation not found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(donation.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Donation Details</h1>
              <p className="text-muted-foreground">
                Reference ID: DON-{donation._id.slice(-8)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${
              donation.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
              donation.status === "Accepted" ? "bg-blue-100 text-blue-800" :
              donation.status === "Completed" ? "bg-green-100 text-green-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {donation.status}
            </div>
          </div>

          {/* Progress Tracker */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${statusInfo.color} bg-opacity-10`}>
                    <StatusIcon className={`h-6 w-6 ${statusInfo.color} text-white`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{statusInfo.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(donation.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Progress value={statusInfo.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NGO Information */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">NGO Information</h3>
                  </div>
                  <div className="pl-8">
                    <p className="font-medium text-lg">{donation.ngo.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pickup Details */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Pickup Details</h3>
                  </div>
                  <div className="pl-8 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{donation.pickupAddress}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        {donation.pickupOption === "asap"
                          ? "As soon as possible"
                          : `${new Date(donation.pickupDate!).toLocaleDateString()} - ${
                              donation.pickupTime === "morning"
                                ? "Morning (9 AM - 12 PM)"
                                : donation.pickupTime === "afternoon"
                                ? "Afternoon (12 PM - 3 PM)"
                                : "Evening (3 PM - 6 PM)"
                            }`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donated Items */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Donated Items</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {donation.items.map((item, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{item.itemName}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                      {item.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {item.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="space-y-2">
                              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                                <img
                                  src={image.url}
                                  alt={`${item.itemName} ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {image.analysis && (
                                <p className="text-xs text-muted-foreground">{image.analysis}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {index < donation.items.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 