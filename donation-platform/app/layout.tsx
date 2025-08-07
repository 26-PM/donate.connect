import type { Metadata } from "next"
import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DonateConnect - Connect Donors with NGOs",
  description: "A platform for donors to donate items to nearby NGOs",
  icons: {
    icon: "/donateconnect.png",
    shortcut: "/donateconnect.png",
    apple: "/donateconnect.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DonateConnect"
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
