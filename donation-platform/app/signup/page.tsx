"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, Eye, EyeOff, Gift, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Define the categories of items that NGOs can accept
const itemCategories = [
  { id: "Clothes", label: "Clothes" },
  { id: "Books", label: "Books" },
  { id: "Toys", label: "Toys" },
  { id: "Medicines", label: "Medicines" },
  { id: "Electronics", label: "Electronics" },
  { id: "Others", label: "Others" },
];

export default function SignupPage() {
  const [userType, setUserType] = useState<"donor" | "ngo">("donor")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Handle item category selection
  const handleItemSelection = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  const handleDonorSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    const formData = new FormData(form)

    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords are identical",
        variant: "destructive"
      })
      return
    }

    // Basic email validation
    const email = formData.get("email") as string
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    // Phone validation
    const phone = formData.get("phone") as string
    if (!phone.startsWith("+91") || phone.length < 13) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Indian phone number starting with +91",
        variant: "destructive"
      })
      return
    }

    const donorData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      mobile: formData.get("phone"),
      password,
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup/user`, donorData)
      toast({
        title: "Donor account created successfully",
        description: "You can now log in with your credentials",
      })
      router.push("/login")
    } catch (error: any) {
      console.log(error)
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        const { status, data } = error.response
        
        if (status === 400 && data.msg === "User already exists") {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive",
          })
        } else if (status === 422 || status === 400) {
          // Validation errors
          toast({
            title: "Validation error",
            description: data.msg || "Please check your information and try again.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Signup failed",
            description: data.msg || "An error occurred during donor signup. Please try again.",
            variant: "destructive",
          })
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast({
          title: "Network error",
          description: "Could not connect to the server. Please check your internet connection.",
          variant: "destructive",
        })
      } else {
        // Something else happened in setting up the request
        toast({
          title: "Signup failed",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        })
      }
    }
  }

  const handleNgoSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    const formData = new FormData(form)

    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords are identical",
        variant: "destructive"
      })
      return
    }

    // Check if at least one item category is selected
    if (selectedItems.length === 0) {
      toast({
        title: "Items selection required",
        description: "Please select at least one category of items your NGO accepts",
        variant: "destructive"
      })
      return
    }

    // Basic email validation
    const email = formData.get("ngoEmail") as string
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    // Phone validation
    const phone = formData.get("contactPhone") as string
    if (!phone.startsWith("+91") || phone.length < 13) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Indian phone number starting with +91",
        variant: "destructive"
      })
      return
    }

    // Registration number validation
    // const regNumber = formData.get("registrationNumber") as string
    // if (regNumber.length < 5) {
    //   toast({
    //     title: "Invalid registration number",
    //     description: "Please enter a valid NGO registration number",
    //     variant: "destructive"
    //   })
    //   return
    // }

    // Structure data to match the backend model
    const ngoData = {
      name: formData.get("ngoName"),
      registrationNumber: formData.get("registrationNumber"),
      email: formData.get("ngoEmail"),
      password,
      mobile: formData.get("contactPhone"),
      // Structure address fields as a nested object to match the backend model
      address: {
        streetNumber: formData.get("street"),
        landmark: formData.get("landmark") || "",
        city: formData.get("city"),
        state: formData.get("state"),
        country: formData.get("country"),
        pincode: formData.get("pincode"),
      },
      itemsAccepted: selectedItems, // Categories the NGO accepts
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup/ngo`, ngoData)
      toast({
        title: "NGO account created successfully",
        description: "You can now log in with your credentials",
      })
      router.push("/login")
    } catch (error: any) {
      console.error(error)
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        const { status, data } = error.response
        
        if (status === 400 && data.msg === "NGO already exists") {
          toast({
            title: "Account already exists",
            description: "An NGO with this email or registration number already exists. Please login instead.",
            variant: "destructive",
          })
        } else if (status === 422 || status === 400) {
          // Validation errors
          const errorMessage = data.msg || "Please check your information and try again."
          toast({
            title: "Validation error",
            description: errorMessage,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Signup failed",
            description: data.msg || "An error occurred during NGO signup. Please try again.",
            variant: "destructive",
          })
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast({
          title: "Network error",
          description: "Could not connect to the server. Please check your internet connection.",
          variant: "destructive",
        })
      } else {
        // Something else happened in setting up the request
        toast({
          title: "Signup failed",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (userType === "donor") {
      await handleDonorSignup(e)
    } else {
      await handleNgoSignup(e)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Gift className="h-6 w-6 text-primary" />
            <span>DonateConnect</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-2xl px-4">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground">Choose your account type and fill in your details</p>
            </div>

            <RadioGroup
              defaultValue="donor"
              className="grid grid-cols-2 gap-4"
              onValueChange={(value) => setUserType(value as "donor" | "ngo")}
            >
              <div>
                <RadioGroupItem value="donor" id="donor" className="peer sr-only" />
                <Label
                  htmlFor="donor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <User className="mb-3 h-6 w-6" />
                  <p className="font-medium">Register as Donor</p>
                  <p className="text-sm text-muted-foreground">For individuals who want to donate items</p>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="ngo" id="ngo" className="peer sr-only" />
                <Label
                  htmlFor="ngo"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <Building className="mb-3 h-6 w-6" />
                  <p className="font-medium">Register as NGO</p>
                  <p className="text-sm text-muted-foreground">For organizations that collect and distribute donations</p>
                </Label>
              </div>
            </RadioGroup>

            <Card>
              <CardHeader>
                <CardTitle>{userType === "donor" ? "Donor Information" : "NGO Information"}</CardTitle>
                <CardDescription>
                  {userType === "donor"
                    ? "Please provide your personal details"
                    : "Please provide your organization details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {userType === "donor" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" name="firstName" placeholder="Abc" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" name="lastName" placeholder="Xyz" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="abc@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+91 9876543210" required />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="ngoName">NGO Name</Label>
                        <Input id="ngoName" name="ngoName" placeholder="Hope Foundation" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input id="registrationNumber" name="registrationNumber" placeholder="NGO123456" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ngoEmail">Email</Label>
                        <Input id="ngoEmail" name="ngoEmail" type="email" placeholder="contact@ngo.org" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Person Name</Label>
                          <Input id="contactName" name="contactName" placeholder="Jane Smith" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Contact Phone</Label>
                          <Input id="contactPhone" name="contactPhone" type="tel" placeholder="+91 9876543210" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street">Street</Label>
                        <Input id="street" name="street" placeholder="123 Charity St" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                        <Input id="landmark" name="landmark" placeholder="Near Central Park" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" placeholder="Helptown" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" name="state" placeholder="Helstate" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" name="country" placeholder="India" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" name="pincode" placeholder="123456" required />
                        </div>
                      </div>

                      {/* Item Categories Selection */}
                      <div className="space-y-3">
                        <Label>Items Accepted</Label>
                        <p className="text-sm text-muted-foreground">Select the categories of items your NGO accepts for donation</p>
                        <div className="grid grid-cols-2 gap-2">
                          {itemCategories.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={item.id} 
                                checked={selectedItems.includes(item.id)} 
                                onCheckedChange={() => handleItemSelection(item.id)} 
                              />
                              <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
                                {item.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
