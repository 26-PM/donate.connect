"use client"

import { useState } from "react"
import Image from "next/image"
import DonationForm from "@/components/donation-form"
import DonorDashboard from "@/components/donor-dashboard"
import styles from "@/styles/home.module.css"

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/placeholder.svg?height=40&width=40" alt="Donation App Logo" width={40} height={40} />
          <h1>DonateForward</h1>
        </div>
        <nav className={styles.nav}>
          <button className={!showDashboard ? styles.activeTab : ""} onClick={() => setShowDashboard(false)}>
            Donate
          </button>
          <button className={showDashboard ? styles.activeTab : ""} onClick={() => setShowDashboard(true)}>
            My Donations
          </button>
        </nav>
      </header>

      <div className={styles.container}>{showDashboard ? <DonorDashboard /> : <DonationForm />}</div>
    </main>
  )
}

