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
import { useToast } from "@/components/ui/use-toast"
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
  // ... (rest of the NGO data remains the same)
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
  const [selectedNGO, setSelectedNGO] = useState<typeof ngos[0] | null>(
    ngoId ? ngos.find(ngo => ngo.id === ngoId) || null : null
  )
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

  // ... (rest of the component logic remains the same)

  if (!selectedNGO && step === 1) {
    router.push("/donor/ngos")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ... (rest of the JSX remains the same) */}
    </div>
  )
}
