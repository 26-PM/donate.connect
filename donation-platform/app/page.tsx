import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Gift, Clock, CheckCircle, Star } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Gift className="h-6 w-6 text-primary" />
            <span>DonateConnect</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#why-donate" className="text-sm font-medium hover:text-primary">
              Why Donate
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
            <Link href="#top-ngos" className="text-sm font-medium hover:text-primary">
              Top NGOs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=800&width=1600"
              alt="People donating"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="container relative z-10 py-24 md:py-32 lg:py-40">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Donate with a Click, Impact a Life
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Connect with nearby NGOs and make a difference in your community by donating items you no longer need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/donate">
                  <Button size="lg" className="gap-2">
                    Donate Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {/* <Link href="/ngos">
                  <Button size="lg" variant="outline">
                    Find NGOs
                  </Button>
                </Link> */}
                <Link href="/signup">
                  <Button size="lg" variant="secondary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Our platform makes donating simple and efficient, connecting donors directly with NGOs in need.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Select Items to Donate</h3>
                <p className="text-muted-foreground">
                  Choose from categories like food, clothes, books, and more. Add details and photos of your items.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Choose Pickup Time</h3>
                <p className="text-muted-foreground">
                  Select a convenient date and time for the NGO to collect your donations.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">NGO Collects & Distributes</h3>
                <p className="text-muted-foreground">
                  The NGO picks up your donation and distributes it to those in need, making a positive impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Donate Section */}
        <section id="why-donate" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Why Donate</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Your donations make a real difference in people's lives while promoting sustainability.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Help Communities</h3>
                <p className="text-muted-foreground">
                  Your donations directly support underprivileged communities, providing essential items to those who
                  need them most.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Reduce Waste</h3>
                <p className="text-muted-foreground">
                  Give your unused items a second life instead of throwing them away, promoting sustainability and
                  reducing landfill waste.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Hassle-Free Process</h3>
                <p className="text-muted-foreground">
                  Our platform makes donating easy with a simple process, convenient pickup options, and transparent
                  tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">What People Say</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Hear from donors and NGOs who have used our platform to make a difference.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I had so many clothes that I no longer wore. DonateConnect made it incredibly easy to donate them to
                  a local shelter. The pickup was prompt, and I received updates about how my donation helped others."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium">SM</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Miller</h4>
                    <p className="text-sm text-muted-foreground">Donor</p>
                  </div>
                </div>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a small NGO, we struggled to find consistent donations. This platform has connected us with
                  generous donors in our area, allowing us to help more families in need. The process is streamlined and
                  efficient."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium">RJ</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Rahul Joshi</h4>
                    <p className="text-sm text-muted-foreground">Hope Foundation NGO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top NGOs Section */}
        <section id="top-ngos" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Featured NGOs</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                These organizations are making a significant impact in their communities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Hope Foundation",
                  mission: "Providing education and basic necessities to underprivileged children",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  name: "Green Earth Initiative",
                  mission: "Promoting sustainability and environmental conservation through community action",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  name: "Care for All",
                  mission: "Supporting elderly and disabled individuals with essential services and companionship",
                  image: "/placeholder.svg?height=200&width=300",
                },
              ].map((ngo, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Image
                    src={ngo.image || "/placeholder.svg"}
                    alt={ngo.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{ngo.name}</h3>
                    <p className="text-muted-foreground mb-4">{ngo.mission}</p>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/50 backdrop-blur-sm">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 font-bold mb-6">
                <Gift className="h-6 w-6 text-primary" />
                <span className="text-lg">DonateConnect</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connecting donors with NGOs to make a positive impact in communities. Together, we can create a better world through giving.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#why-donate" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Why Donate
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Contact Us</h3>
              <ul className="space-y-4">
                <li className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="bg-primary/10 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  info@donateconnect.com
                </li>
                <li className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="bg-primary/10 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  +1 (555) 123-4567
                </li>
                <li className="flex gap-4 mt-6">
                  {[
                    {
                      name: "Twitter",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    },
                    {
                      name: "Facebook",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    },
                    {
                      name: "Instagram",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    },
                    {
                      name: "LinkedIn",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    }
                  ].map((social) => (
                    <Link 
                      key={social.name} 
                      href="#" 
                      className="bg-background hover:bg-primary/10 transition-colors p-2 rounded-full"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DonateConnect. All rights reserved.</p>
            <p className="mt-2">Developed with ❤️ by <Link href="/" className="text-primary hover:text-primary/80">PM & MA</Link></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

