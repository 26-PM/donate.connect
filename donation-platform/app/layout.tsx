import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ToastContainer } from "react-toastify";


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DonateConnect - Connect Donors with NGOs",
  description: "A platform for donors to donate items to nearby NGOs"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <ToastContainer />
      </body>
    </html>
  )
}
