"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Building2,
  Landmark,
  Hash,
  Image as ImageIcon,
  Gift,
  ChevronRight,
  Star,
  Users,
  Heart
} from "lucide-react"
import Image from "next/image"

// This would come from your API/database
const ngo = {
  id: "ngo1",
  name: "Hope Foundation",
  registrationNumber: "NGO123456",
  address: {
    street: "123 Charity St",
    landmark: "Near City Hospital",
    city: "Helptown",
    state: "Maharashtra",
    country: "India",
    pincode: "400001"
  },
  contact: {
    email: "contact@hopefoundation.org",
    phone: "+91 9876543210",
    personContact: "+91 9876543211"
  },
  description: "Supporting education and healthcare initiatives in underprivileged communities. We work with underprivileged children and provide them with quality education and healthcare facilities.",
  acceptedItems: ["Books", "School Supplies", "Medical Equipment", "Clothes", "Food Items"],
  photos: [
    "/images/ngo1.jpg",
    "/images/ngo2.jpg",
    "/images/ngo3.jpg"
  ],
  stats: {
    beneficiaries: "5000+",
    projects: "25+",
    years: "10+",
    rating: 4.8,
    reviews: 128
  }
}

export default function NGOProfilePage() {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{ngo.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{ngo.stats.rating}</span>
              <span className="text-muted-foreground text-sm">({ngo.stats.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span>Reg. No: {ngo.registrationNumber}</span>
            </div>
          </div>
        </div>
        <Button size="lg" className="group" asChild>
          <a href={`/donate?ngoId=${ngo.id}`} className="flex items-center">
            <Gift className="mr-2 h-4 w-4" />
            Donate Here
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{ngo.stats.beneficiaries}</p>
              <p className="text-sm text-muted-foreground">Beneficiaries</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{ngo.stats.projects}</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{ngo.stats.years}</p>
              <p className="text-sm text-muted-foreground">Years of Service</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{ngo.description}</p>
            
            <div>
              <h3 className="font-medium mb-2 text-primary">Items We Accept</h3>
              <div className="flex flex-wrap gap-2">
                {ngo.acceptedItems.map((item) => (
                  <Badge key={item} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${ngo.contact.email}`} className="hover:text-primary">
                  {ngo.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${ngo.contact.phone}`} className="hover:text-primary">
                  {ngo.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <Users className="h-4 w-4 text-primary" />
                <span>Contact Person: {ngo.contact.personContact}</span>
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
                <span>{ngo.address.street}</span>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                <Landmark className="h-4 w-4 text-primary" />
                <span>{ngo.address.landmark}</span>
              </div>
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
            <CardTitle className="text-xl font-bold">Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {ngo.photos.map((photo, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                  <Image
                    src={photo}
                    alt={`${ngo.name} photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 