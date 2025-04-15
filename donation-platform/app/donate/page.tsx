"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Camera, Check, Clock, Gift, MapPin, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { GoogleGenerativeAI } from "@google/generative-ai"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

interface DecodedToken {
  id: string;
  type: string;
  iat: number;
  exp: number;
}

// Donation categories with icons
const categories = [
  { id: "Clothes", name: "Clothes", icon: "👕" },
  { id: "Books", name: "Books", icon: "📚" },
  { id: "Toys", name: "Toys", icon: "🧸" },
  { id: "Medicines", name: "Medicines", icon: "💊" },
  { id: "Electronics", name: "Electronics", icon: "📱" },
  { id: "Others", name: "Others", icon: "📦" },
]

interface DonationItem {
  category: string
  quantity: string
  description: string
  images: Array<{
    url: string
    analysis?: string
  }>
}

interface NGOData {
  itemsAccepted: string[];
  name: string;
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonateContent />
    </Suspense>
  )
}

function DonateContent() {
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
  const [ngoData, setNgoData] = useState<NGOData | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  useEffect(() => {
    if (!ngoId) {
      router.push("/donor/ngos")
      return
    }

    // Fetch NGO details including accepted items
    const fetchNGODetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/ngos/${ngoId}`)
        setNgoData({
          itemsAccepted: response.data.data.itemsAccepted,
          name: response.data.data.name
        });
      } catch (error) {
        console.error('Error fetching NGO details:', error)
        toast({
          title: "Error",
          description: "Failed to fetch NGO details. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchNGODetails()
  }, [ngoId, router, toast])

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

  const uploadToCloudinary = async (base64Image: string) => {
    try {
      // Convert base64 to blob
      const base64Response = await fetch(base64Image);
      const blob = await base64Response.blob();
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', 'donation_images');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setImageUploadError(null);
      setIsUploadingImage(true);
      const files = e.target.files;
      
      if (!files || files.length === 0) {
        setIsUploadingImage(false);
        return;
      }

      // Check total number of images
      if (currentItem.images.length + files.length > 5) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 5 images per item",
          variant: "destructive",
        });
        setIsUploadingImage(false);
        return;
      }

      toast({
        title: "Processing images",
        description: "Uploading and analyzing your images...",
      });

      // Process each file
      const uploadPromises = Array.from(files).map(async (file) => {
        return new Promise<{ url: string; analysis: string }>(async (resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            if (e.target?.result) {
              const base64Image = e.target.result as string;
              
              try {
                // Upload to Cloudinary first
                const cloudinaryUrl = await uploadToCloudinary(base64Image);
                
                // Get image analysis
                const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                
                const result = await model.generateContent([
                  "Analyze this image and describe the item in detail, including its condition, material, and any visible damage or wear. Be specific about the item's current state.",
                  {
                    inlineData: {
                      data: base64Image.split(",")[1],
                      mimeType: "image/jpeg"
                    }
                  }
                ]);
                
                const response = await result.response;
                const analysis = response.text();
                
                resolve({ url: cloudinaryUrl, analysis });
              } catch (error) {
                console.error("Upload or analysis error:", error);
                toast({
                  title: "Error",
                  description: "Failed to process image. Please try again.",
                  variant: "destructive",
                });
                resolve({ url: base64Image, analysis: "Analysis failed" });
              }
            }
          };
          reader.readAsDataURL(file);
        });
      });

      const processedImages = await Promise.all(uploadPromises);
      setCurrentItem(prevItem => ({
        ...prevItem,
        images: [...prevItem.images, ...processedImages]
      }));

      toast({
        title: "Success",
        description: "Images uploaded and analyzed successfully!",
      });

    } catch (error) {
      setImageUploadError("Failed to upload images. Please try again.");
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      if (!address) {
        toast({
          title: "Missing address",
          description: "Please provide a pickup address",
          variant: "destructive",
        })
        return
      }
      
      const token = localStorage.getItem('token')
      const decodedToken = token ? jwtDecode<DecodedToken>(token) : null
      const userId = decodedToken?.id
      if (!userId) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive",
        })
        return
      }
      
      // Process items with proper format
      const processedItems = selectedItems.map(item => ({
        itemName: item.category,  // Using category as itemName
        quantity: parseInt(item.quantity),
        description: item.description || "",
        images: item.images || []  // Ensure images array is included
      }));
      
      // Split address into components
      const addressParts: string[] = address.split(',').map((part: string) => part.trim())
      if (addressParts.length < 5) {
        toast({
          title: "Invalid address format",
          description: "Please provide address in format: Street, Landmark, City, State, Pincode",
          variant: "destructive",
        })
        return
      }
      
      const donationData = {
        userId: userId,
        ngo: ngoId,
        items: processedItems,
        pickupOption: pickupOption,
        pickupDate: pickupOption === "asap" ? null : pickupDate,
        pickupTime: pickupOption === "asap" ? null : pickupTime,
        pickupAddress: address,  // Send the original address string
        notes: ""
      };

      console.log(donationData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/donate`,
        donationData,
        {
          withCredentials: true
        }
      );
      console.log(response.data);
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Your donation has been submitted successfully.",
        });
        router.push("/donor/dashboard");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                    {categories
                      .filter(category => ngoData?.itemsAccepted?.includes(category.id))
                      .map((category) => (
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
                      <div className="flex flex-col gap-4">
                        {currentItem.images.map((image, index) => (
                          <div key={index} className="space-y-2">
                            <div className="relative w-24 h-24 border rounded">
                              <img
                                src={image.url}
                                alt={`Donation item ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                onClick={() => {
                                  const newImages = [...currentItem.images];
                                  newImages.splice(index, 1);
                                  setCurrentItem({ ...currentItem, images: newImages });
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            {image.analysis && (
                              <div className="w-full p-2 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  {image.analysis}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                        <label
                          htmlFor="image-upload"
                          className={`w-24 h-24 border border-dashed rounded flex flex-col items-center justify-center text-muted-foreground hover:text-foreground ${
                            isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {isUploadingImage ? (
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-1"></div>
                              <span className="text-xs">Processing...</span>
                            </div>
                          ) : (
                            <>
                              <Camera className="h-6 w-6 mb-1" />
                              <span className="text-xs">Add Photo</span>
                            </>
                          )}
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploadingImage}
                          />
                        </label>
                      </div>
                      {imageUploadError && (
                        <p className="text-sm text-destructive">{imageUploadError}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Maximum 5 images, 5MB each. Supported formats: JPG, PNG, GIF
                      </p>
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
                              {item.images.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {item.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="space-y-1">
                                      <div className="relative w-24 h-24 border rounded">
                                        <img
                                          src={image.url}
                                          alt={`${category?.name} ${imgIndex + 1}`}
                                          className="w-full h-full object-cover rounded"
                                        />
                                      </div>
                                      {image.analysis && (
                                        <div className="w-full p-2 bg-gray-100 rounded-lg">
                                          <p className="text-xs text-gray-700">
                                            {image.analysis}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
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
                              {item.images.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {item.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="space-y-1">
                                      <div className="relative w-24 h-24 border rounded">
                                        <img
                                          src={image.url}
                                          alt={`${category?.name} ${imgIndex + 1}`}
                                          className="w-full h-full object-cover rounded"
                                        />
                                      </div>
                                      {image.analysis && (
                                        <div className="w-full p-2 bg-gray-100 rounded-lg">
                                          <p className="text-xs text-gray-700">
                                            {image.analysis}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
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
                            : `${new Date(pickupDate).toLocaleDateString()} - ${
                                pickupTime === "morning"
                                  ? "Morning (9 AM - 12 PM)"
                                  : pickupTime === "afternoon"
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