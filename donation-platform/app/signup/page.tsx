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

export default function SignupPage() {
  const [userType, setUserType] = useState<"donor" | "ngo">("donor")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
            <div className="space-y-2 text-center">
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
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <User className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Register as Donor</p>
                    <p className="text-sm text-muted-foreground">For individuals who want to donate items</p>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="ngo" id="ngo" className="peer sr-only" />
                <Label
                  htmlFor="ngo"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Building className="mb-3 h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Register as NGO</p>
                    <p className="text-sm text-muted-foreground">
                      For organizations that collect and distribute donations
                    </p>
                  </div>
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
                    // Donor Registration Form
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="Abc" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Xyz" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="abc@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+91 0000000000" required />
                      </div>
                    </>
                  ) : (
                    // NGO Registration Form
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="ngoName">NGO Name</Label>
                        <Input id="ngoName" placeholder="Hope Foundation" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input id="registrationNumber" placeholder="NGO123456" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ngoEmail">Email</Label>
                        <Input id="ngoEmail" type="email" placeholder="contact@hopefoundation.org" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Person Name</Label>
                          <Input id="contactName" placeholder="Jane Smith" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Contact Phone</Label>
                          <Input id="contactPhone" type="tel" placeholder="+1 (555) 987-6543" required />
                        </div>
                      </div>
                      <div className="space-y-2">
    <Label htmlFor="street">Street</Label>
    <Input id="street" placeholder="123 Charity St" required />
  </div>
  <div className="space-y-2">
    <Label htmlFor="landmark">Landmark (Optional)</Label>
    <Input id="landmark" placeholder="Near Central Park" />
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="city">City</Label>
      <Input id="city" placeholder="Helptown" required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="state">State</Label>
      <Input id="state" placeholder="Helstate" required />
    </div>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="country">Country</Label>
      <Input id="country" placeholder="Country Name" required />
    </div>
    <div className="space-y-2">
      <Label htmlFor="pincode">Pincode</Label>
      <Input id="pincode" placeholder="123456" required />
    </div>
  </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="verificationDoc">Upload NGO Verification Document (Optional)</Label>
                        <div className="flex items-center gap-4">
                          <Button type="button" variant="outline" className="w-full" onClick={() => {}}>
                            <Upload className="mr-2 h-4 w-4" />
                            Choose File
                          </Button>
                          <p className="text-sm text-muted-foreground">No file chosen</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload a PDF or image of your NGO registration certificate (Max 5MB)
                        </p>
                      </div> */}
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
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
                    <Input id="confirmPassword" type="password" placeholder="••••••••" required />
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

