"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Building2,
  Hash,
  Gift,
  ChevronRight,
  Star
} from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface NGO {
  _id: string
  name: string
  registrationNumber: string
  email: string
  mobile: string
  address: {
    streetNumber: string
    landmark?: string
    city: string
    state: string
    country: string
    pincode: string
  }
  itemsAccepted: string[]
}

export default function NGOProfilePage() {
  const params = useParams()
  const { toast } = useToast()
  const [ngo, setNgo] = useState<NGO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNGO = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/ngos/${params.id}`)
        setNgo(res.data.data)
      } catch (err) {
        console.error("Failed to fetch NGO:", err)
        toast({
          title: "Error",
          description: "Failed to load NGO details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNGO()
  }, [params.id, toast])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!ngo) {
    return <div className="flex items-center justify-center min-h-screen">NGO not found</div>
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{ngo.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span>Reg. No: {ngo.registrationNumber}</span>
            </div>
          </div>
        </div>
        <Button size="lg" className="group" asChild>
          <Link href={`/donate?ngoId=${ngo._id}`} className="flex items-center">
            <Gift className="mr-2 h-4 w-4" />
            Donate Here
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${ngo.email}`} className="hover:text-primary">
                  {ngo.email}
                </a>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${ngo.mobile}`} className="hover:text-primary">
                  {ngo.mobile}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <Building2 className="h-4 w-4 text-primary" />
                <span>{ngo.address.streetNumber}</span>
              </div>
              {ngo.address.landmark && (
                <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{ngo.address.landmark}</span>
                </div>
              )}
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {ngo.address.city}, {ngo.address.state}, {ngo.address.country} - {ngo.address.pincode}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Accepted Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ngo.itemsAccepted.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 