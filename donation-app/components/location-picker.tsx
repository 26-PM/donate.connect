"use client"

import type React from "react"

import { useState } from "react"
import styles from "@/styles/location-picker.module.css"

interface LocationPickerProps {
  location: string
  onLocationChange: (location: string) => void
}

export default function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState("")
  const [savedLocations, setSavedLocations] = useState<string[]>([
    "123 Main St, Anytown, USA",
    "456 Oak Ave, Somewhere City, USA",
  ])

  const detectLocation = () => {
    setIsDetecting(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would use a reverse geocoding service
        // to convert coordinates to an address
        const { latitude, longitude } = position.coords

        // Simulate reverse geocoding with a timeout
        setTimeout(() => {
          const detectedAddress = `Detected Address (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          onLocationChange(detectedAddress)
          setIsDetecting(false)
        }, 1500)
      },
      (error) => {
        setError("Unable to retrieve your location")
        setIsDetecting(false)
      },
    )
  }

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange(e.target.value)
  }

  const selectSavedLocation = (savedLocation: string) => {
    onLocationChange(savedLocation)
  }

  return (
    <div className={styles.locationPicker}>
      <div className={styles.detectLocation}>
        <button type="button" className={styles.detectButton} onClick={detectLocation} disabled={isDetecting}>
          {isDetecting ? "Detecting..." : "Detect My Location"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.manualInput}>
        <h3>Or Enter Address Manually</h3>
        <input
          type="text"
          value={location}
          onChange={handleManualInput}
          placeholder="Enter your full address"
          className={styles.addressInput}
        />
      </div>

      {savedLocations.length > 0 && (
        <div className={styles.savedLocations}>
          <h3>Saved Locations</h3>
          <div className={styles.savedLocationsList}>
            {savedLocations.map((savedLocation, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.savedLocationButton} ${location === savedLocation ? styles.selected : ""}`}
                onClick={() => selectSavedLocation(savedLocation)}
              >
                {savedLocation}
              </button>
            ))}
          </div>
        </div>
      )}

      {location && (
        <div className={styles.selectedLocation}>
          <h3>Selected Location</h3>
          <p>{location}</p>
        </div>
      )}
    </div>
  )
}

