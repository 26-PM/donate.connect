"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search, MapPin, Star, Filter, ChevronRight, Hash, Heart
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export default function NGOsPage() {
  const [ngos, setNgos] = useState<any[]>([]) // replace 'any' with your NGO type if you have it
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [loading, setLoading] = useState(true)

  const categories = [
    "all", "Education", "Healthcare", "Environment", "Social Services",
    "Children", "Elderly Care", "Disability Support", "Sustainability"
  ]

  // Sample NGO images - in production, these would come from your backend
  const ngoImages = [
    "https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=2070",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070",
    "https://images.unsplash.com/photo-1469571486292-b53601010b89?q=80&w=2070",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070",
    "https://images.unsplash.com/photo-1607748851687-ba9a10438621?q=80&w=2070",
    "https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=2070"
  ]

  // Fallback image in case of loading errors
  const fallbackImage = "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070"

  useEffect(() => {
    const fetchNgos = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/ngos`)
        // Add random images to each NGO
        const ngosWithImages = (res.data.data || []).map((ngo: any, index: number) => ({
          ...ngo,
          imageUrl: ngoImages[index % ngoImages.length] || fallbackImage
        }))
        setNgos(ngosWithImages)
        console.log(res.data.data)
      } catch (err) {
        console.error("Failed to fetch NGOs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNgos()
  }, [])

  const filteredNgos = ngos.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ngo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || ngo.categories?.includes(category);
    return matchesSearch && matchesCategory;
  });

  const sortedNgos = [...filteredNgos].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Hero section */}
      <div className="relative rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <Image 
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070" 
          alt="NGOs Hero" 
          width={1400} 
          height={400} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Find NGOs That Need Your Help</h1>
          <p className="text-white/90 max-w-2xl">Discover organizations making a difference in your community and around the world.</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search NGOs..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* NGO Cards */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedNgos.map((ngo, index) => (
            <Card key={ngo.id || ngo._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="relative h-48 w-full">
                <Image 
                  src={ngo.imageUrl || fallbackImage} 
                  alt={ngo.name} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                  }}
                />
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{ngo.rating ?? "N/A"}</span>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent h-24"></div>
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="flex flex-wrap gap-2">
                    {ngo.categories?.slice(0, 3).map((category: string) => (
                      <Badge key={category} className="bg-primary/90 text-white hover:bg-primary">
                        {category}
                      </Badge>
                    ))}
                    {ngo.categories?.length > 3 && (
                      <Badge className="bg-gray-700/90 text-white">
                        +{ngo.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{ngo.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {ngo.location || "Location N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{ngo.description}</p>
                <div>
                  <p className="text-sm font-medium mb-2 text-primary">Currently Needs:</p>
                  <div className="flex flex-wrap gap-2">
                    {ngo.needs?.slice(0, 3).map((need: string) => (
                      <Badge key={need} variant="outline" className="border-primary/20">
                        {need}
                      </Badge>
                    ))}
                    {ngo.needs?.length > 3 && (
                      <Badge variant="outline" className="border-primary/20">
                        +{ngo.needs.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span className="truncate max-w-[120px]">{ngo.registrationNumber || "Reg. pending"}</span>
                </div>
                <Button className="bg-primary hover:bg-primary/90" size="sm" asChild>
                  <Link href={`/donor/ngos/${ngo._id}`}>
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && sortedNgos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No NGOs Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any NGOs matching your search criteria. Try adjusting your filters or search term.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
