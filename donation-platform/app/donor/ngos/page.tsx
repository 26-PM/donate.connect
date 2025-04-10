"use client"

import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

const ngos = [
  {
    id: "ngo1",
    name: "Feeding Hope",
    description: "Providing nutritious meals",
    areas: ["Delhi", "Noida"]
  },
  {
    id: "ngo2", 
    name: "Education for All",
    description: "Supporting children's education",
    areas: ["Mumbai", "Pune"]
  }
]

export default function NgoListPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ngos.map((ngo) => (
          <Link href={`/donate?ngoId=${ngo.id}`} key={ngo.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{ngo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{ngo.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Areas: {ngo.areas.join(", ")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
