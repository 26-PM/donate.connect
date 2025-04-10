"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, ArrowRight, Camera, Check, Clock, Gift, 
  MapPin, Plus, Trash2, Heart, Building, Shield 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Donation categories with icons
const categories = [
  { id: "food", name: "Food", icon: "🥗" },
  { id: "clothes", name: "Clothes", icon: "👕" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "medicines", name: "Medicines", icon: "💊" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "others", name: "Others", icon: "📦" },
]

// NGO list with sample data
const ngos = [
  { 
    id: "ngo1", 
    name: "Feeding Hope", 
    logo: "🍽️", 
    description: "Providing nutritious meals to underprivileged communities",
    areas: ["Delhi", "Noida", "Ghaziabad"],
    causes: ["Food", "Nutrition", "Children"] 
  },
]

interface DonationItem {
  category: string
  quantity: string
  description: string
  images: string[]
}

export default function DonatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ngoId = searchParams.get('ngoId')
  const { toast } = useToast()

  const [nearestNGO, setNearestNGO] = useState("")
const [selectedNGO, setSelectedNGO] = useState<typeof ngos[0] | null>(() => {
    console.log('Finding NGO for id:', ngoId)
    return ngoId ? ngos.find(ngo => ngo.id === ngoId) || null : null
  })
  const [step, setStep] = useState(selectedNGO ? 2 : 1)
  const [selectedItems, setSelectedItems] = useState<DonationItem[]>([])
  const [currentItem, setCurrentItem] = useState<DonationItem>({
    category: "",
    quantity: "",
    description: "",
    images: [],
  })
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [pickupOption, setPickupOption] = useState("scheduled")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!selectedNGO && step === 1) {
    router.push("/donor/ngos")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        {selectedNGO && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedNGO.logo}</div>
                <div>
                  <CardTitle>{selectedNGO.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedNGO.description}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={currentItem.category}
                    onValueChange={(value) => setCurrentItem({...currentItem, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                    placeholder="How many items?"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                    placeholder="Item details (condition, specifications, etc.)"
                  />
                </div>

                <div>
                  <Label>Images (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Add Photos
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentItem.images.length} selected
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!currentItem.category || !currentItem.quantity) {
                      toast({
                        title: "Missing required fields",
                        description: "Please select category and enter quantity",
                        variant: "destructive"
                      })
                      return
                    }
                    setSelectedItems([...selectedItems, currentItem])
                    setCurrentItem({
                      category: "",
                      quantity: "",
                      description: "",
                      images: []
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pickup Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup
                  value={pickupOption}
                  onValueChange={setPickupOption}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <div>
                    <RadioGroupItem value="scheduled" id="scheduled" className="peer sr-only" />
                    <Label
                      htmlFor="scheduled"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Clock className="mb-2 h-6 w-6" />
                      Scheduled Pickup
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dropoff" id="dropoff" className="peer sr-only" />
                    <Label
                      htmlFor="dropoff"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <MapPin className="mb-2 h-6 w-6" />
                      Drop Off
                    </Label>
                  </div>
                </RadioGroup>

                {pickupOption === "scheduled" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Pickup Date</Label>
                      <Input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Pickup Time</Label>
                      <Input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Where should we pickup the items?"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items to donate:</span>
                    <span>{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {selectedItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)} items
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={isLoading || selectedItems.length === 0}
                  onClick={async () => {
                    setIsLoading(true)
                    try {
                      // TODO: Implement actual donation submission
                      await new Promise(resolve => setTimeout(resolve, 1000))
                      toast({
                        title: "Donation scheduled!",
                        description: "Thank you for your generosity",
                      })
                      router.push("/donor/dashboard")
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to schedule donation",
                        variant: "destructive"
                      })
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                >
                  {isLoading ? (
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Gift className="mr-2 h-4 w-4" />
                  )}
                  Schedule Donation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
