"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Camera, Check, Clock, Gift, MapPin, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// Donation categories with icons
const categories = [
  { id: "food", name: "Food", icon: "🥗" },
  { id: "clothes", name: "Clothes", icon: "👕" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "medicines", name: "Medicines", icon: "💊" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "others", name: "Others", icon: "📦" },
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

  const [step, setStep] = useState(1)
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
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (!ngoId) {
      router.push("/donor/ngos")
      return
    }
  }, [ngoId, router])

  const handleAddItem = () => {
    if (!currentItem.category || !currentItem.quantity) {
      toast({
        title: "Missing information",
        description: "Please select a category and specify quantity",
        variant: "destructive",
      })
      return
    }

    setSelectedItems([...selectedItems, { ...currentItem }])
    setCurrentItem({
      category: "",
      quantity: "",
      description: "",
      images: [],
    })
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...selectedItems]
    updatedItems.splice(index, 1)
    setSelectedItems(updatedItems)
  }

  const handleImageUpload = async () => {
    try {
      setImageUploadError(null)
      // In a real app, this would be an actual file upload
      const newImages = [...currentItem.images]
      newImages.push(`/placeholder.svg?height=200&width=200&text=Image+${currentItem.images.length + 1}`)
      setCurrentItem({ ...currentItem, images: newImages })
    } catch (error) {
      setImageUploadError("Failed to upload image. Please try again.")
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add at least one item to donate",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const donationData = {
        ngo: ngoId,
        items: selectedItems.map(item => ({
          itemName: item.category,
          quantity: parseInt(item.quantity),
          description: item.description,
          images: item.images
        })),
        pickupOption,
        pickupDate: pickupOption === "scheduled" ? pickupDate : null,
        pickupTime: pickupOption === "scheduled" ? pickupTime : null,
        address
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations`, donationData)

      toast({
        title: "Donation request submitted!",
        description: "The NGO will contact you soon to arrange pickup.",
      })

      router.push("/donor/dashboard")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting your donation request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add at least one item to donate",
        variant: "destructive",
      })
      return
    }

    if (step === 2 && pickupOption === "scheduled" && (!pickupDate || !pickupTime)) {
      toast({
        title: "Missing information",
        description: "Please select a pickup date and time",
        variant: "destructive",
      })
      return
    }

    if (step === 3 && !address) {
      toast({
        title: "Missing information",
        description: "Please enter your pickup address",
        variant: "destructive",
      })
      return
    }

    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" onClick={() => router.push("/donor/ngos")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to NGOs
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Make a Donation</h1>
            <p className="text-muted-foreground">
              Fill in the details about your donation
            </p>
          </div>

          {/* Progress Steps */}
          <div className="relative mb-10">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted" />
            <ol className="relative z-10 flex justify-between">
              {[
                { title: "Select Items", icon: Gift },
                { title: "Pickup Time", icon: Clock },
                { title: "Location", icon: MapPin },
                { title: "Review", icon: Check },
              ].map((s, i) => {
                const StepIcon = s.icon
                const isActive = i + 1 === step
                const isCompleted = i + 1 < step

                return (
                  <li key={i} className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        isActive || isCompleted ? "font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Step 1: Select Items */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">What would you like to donate?</h2>

                {/* Category Selection */}
                <div className="space-y-4">
                  <Label>Select Category</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map((category) => (
                      <Card
                        key={category.id}
                        className={`text-center cursor-pointer hover:border-primary transition-colors ${
                          currentItem.category === category.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setCurrentItem({ ...currentItem, category: category.id })}
                      >
                        <CardContent className="p-4">
                          <div className="text-3xl mb-2">{category.icon}</div>
                          <p className="text-sm font-medium">{category.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Item Details */}
                {currentItem.category && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          placeholder="e.g., 5 shirts, 2kg rice"
                          value={currentItem.quantity}
                          onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                          id="description"
                          placeholder="e.g., Men's shirts, size L"
                          value={currentItem.description}
                          onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Images (Optional)</Label>
                      <div className="flex flex-wrap gap-4">
                        {currentItem.images.map((image, index) => (
                          <div key={index} className="relative w-24 h-24 border rounded">
                            <img
                              src={image || "/placeholder.svg"}
                              alt="Donation item"
                              className="w-full h-full object-cover"
                            />
                            <button
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                              onClick={() => {
                                const newImages = [...currentItem.images]
                                newImages.splice(index, 1)
                                setCurrentItem({ ...currentItem, images: newImages })
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          className="w-24 h-24 border border-dashed rounded flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
                          onClick={handleImageUpload}
                        >
                          <Camera className="h-6 w-6 mb-1" />
                          <span className="text-xs">Add Photo</span>
                        </button>
                      </div>
                    </div>

                    <Button onClick={handleAddItem} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Selected Items ({selectedItems.length})</h3>
                  <div className="space-y-3">
                    {selectedItems.map((item, index) => {
                      const category = categories.find((c) => c.id === item.category)

                      return (
                        <div key={index} className="flex items-center justify-between border rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{category?.icon}</div>
                            <div>
                              <p className="font-medium">{category?.name}</p>
                              <p className="text-sm text-muted-foreground">{item.quantity}</p>
                              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => setCurrentItem({ category: "", quantity: "", description: "", images: [] })}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add More Items
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6">
                <Button onClick={nextStep} disabled={selectedItems.length === 0}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Pickup Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-semibold mb-4">Select Pickup Date & Time</h2>

                <RadioGroup
                  defaultValue="scheduled"
                  value={pickupOption}
                  onValueChange={setPickupOption}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled">Schedule a specific date & time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asap" id="asap" />
                    <Label htmlFor="asap">As soon as possible</Label>
                  </div>
                </RadioGroup>

                {pickupOption === "scheduled" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12 PM - 3 PM)</SelectItem>
                          <SelectItem value="evening">Evening (3 PM - 6 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Note: The actual pickup time will be confirmed by the NGO after they accept your donation request.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pickup Location */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-semibold mb-4">Enter Pickup Location</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label htmlFor="address">Address</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          toast({
                            title: "Geolocation not supported",
                            description: "Your browser does not support location tracking.",
                          });
                          return;
                        }
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            const { latitude, longitude } = position.coords;
                            
                            try {
                              const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                              );
                              const data = await response.json();
                              const locationName = data.display_name || "Unknown Location";
                              setAddress(locationName);
                            } catch (error) {
                              setAddress("Failed to fetch address");
                            }
                          },
                          (error) => {
                            toast({
                              title: "Location error",
                              description: error.message,
                            });
                          }
                        );
                      }}
                    >
                      <MapPin className="mr-1 h-3 w-3" />
                      Use Current Location
                    </Button>
                  </div>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address for pickup"
                    className="min-h-[100px]"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Please provide a complete address including building/apartment number, street, city, and postal code.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={nextStep}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Donation</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Items to Donate</h3>
                    <div className="space-y-2">
                      {selectedItems.map((item, index) => {
                        const category = categories.find((c) => c.id === item.category)

                        return (
                          <div key={index} className="flex items-center gap-3 border-b pb-2">
                            <div className="text-xl">{category?.icon}</div>
                            <div>
                              <p className="font-medium">{category?.name}</p>
                              <p className="text-sm text-muted-foreground">{item.quantity}</p>
                              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Pickup Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p>
                          {pickupOption === "asap"
                            ? "As soon as possible"
                            : `${new Date(pickupDate).toLocaleDateString()} - ${pickupTime === "morning"
                              ? "Morning (9 AM - 12 PM)"
                              : pickupOption === "afternoon"
                                ? "Afternoon (12 PM - 3 PM)"
                                : "Evening (3 PM - 6 PM)"
                            }`}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p>{address}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">What happens next?</h3>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                          1
                        </div>
                        <p>Your donation request will be sent to the selected NGO</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                          2
                        </div>
                        <p>The NGO will review your donation and confirm if they can use the items</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                          3
                        </div>
                        <p>You'll receive a notification when the NGO accepts your donation</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                          4
                        </div>
                        <p>The NGO will arrange pickup according to your preferred time</p>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Donation"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}