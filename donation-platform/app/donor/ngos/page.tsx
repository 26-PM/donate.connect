"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search, MapPin, Star, Filter, ChevronRight, Hash
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NGOsPage() {
  const [ngos, setNgos] = useState<any[]>([]) // replace 'any' with your NGO type if you have it
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const categories = [
    "all", "Education", "Healthcare", "Environment", "Social Services",
    "Children", "Elderly Care", "Disability Support", "Sustainability"
  ]

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/ngos`)
        setNgos(res.data.ngos || []) // assuming your backend sends { ngos: [...] }
      } catch (err) {
        console.error("Failed to fetch NGOs:", err)
      }
    }

    fetchNgos()
  }, [])

  // Optional: Filtering/search/sorting can be implemented here

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* ... Filters and header as you already have ... */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ngos.map((ngo) => (
          <Card key={ngo.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{ngo.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {ngo.distance || "N/A"} away
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{ngo.rating ?? "N/A"}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {ngo.categories?.map((category: string) => (
                  <Badge key={category} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{ngo.description}</p>
              <div>
                <p className="text-sm font-medium mb-2 text-primary">Currently Needs:</p>
                <div className="flex flex-wrap gap-2">
                  {ngo.needs?.map((need: string) => (
                    <Badge key={need} variant="outline" className="border-primary/20">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>Reg. No: {ngo.registrationNumber}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                <Link href={`/donor/ngos/${ngo.id}`} className="flex items-center justify-center">
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
