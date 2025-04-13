'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Clock, CheckCircle, Star, Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

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
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border hover:bg-muted"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
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
            <div className="w-full h-full relative">
              <Image
                src="https://plus.unsplash.com/premium_photo-1738416571378-46793a101767?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Digital donation platform connecting donors and NGOs"
                fill
                className="object-cover opacity-20"
                priority
                unoptimized={true}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
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
                  image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
                },
                {
                  name: "Green Earth Initiative",
                  mission: "Promoting sustainability and environmental conservation through community action",
                  image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
                },
                {
                  name: "Care for All",
                  mission: "Supporting elderly and disabled individuals with essential services and companionship",
                  image: "https://plus.unsplash.com/premium_photo-1658506620365-925c827c6fdc?q=80&w=3138&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold mb-4">
                <Gift className="h-6 w-6 text-primary" />
                <span>DonateConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting donors with NGOs to make a positive impact in communities.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#why-donate" className="text-muted-foreground hover:text-foreground">
                    Why Donate
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-foreground">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-muted-foreground hover:text-foreground">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">Email: info@donateconnect.com</li>
                <li className="text-muted-foreground">Phone: +1 (555) 123-4567</li>
                <li className="flex gap-4 mt-4">
                  {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                    <Link key={social} href="#" className="text-muted-foreground hover:text-foreground">
                      <div className="h-8 w-8 border rounded-full flex items-center justify-center">
                        <span className="sr-only">{social}</span>
                        <div className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DonateConnect. All rights reserved.</p>
            <p>Made with ❤️ by PM and MA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

